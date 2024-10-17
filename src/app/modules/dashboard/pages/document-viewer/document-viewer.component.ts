import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CdkTreeModule, CdkTree } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DocumentosService } from 'src/app/core/services/documentos.service';
import { WPMedia } from 'src/app/core/models/wp.model';
import { MakeFolderDialogComponent } from '../../components/documen-view/make-folder-dialog/make-folder-dialog.component';
import { BreadcrumbComponent } from '../../components/documen-view/breadcrumb/breadcrumb.component';

interface Carpeta {
  nombre: string;
  hijos: Carpeta[];
  documentos?: WPMedia[]; // Documentos dentro de la carpeta.
  tipo?: string;
  socioId?: number;
  parent?: Carpeta | null;
  selected?: boolean;
  fechaModificacion?: Date;
}

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CdkTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    CommonModule,
    MakeFolderDialogComponent,
    BreadcrumbComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent implements OnInit {
  // Documentos en la carpeta actual
  documentos: WPMedia[] = [];
  vista: 'grid' | 'list' = 'grid';
  carpetaSeleccionada: Carpeta | null = null;
  rutaActual: Carpeta[] = [];

  documentoSeleccionado: WPMedia[] = [];
  carpetasSeleccionadas: Carpeta[] = [];
  todosSeleccionados: boolean = false;

  expandedNodeNames: Set<string> = new Set<string>();
  expandedNodesSet: Set<Carpeta> = new Set<Carpeta>();

  @ViewChild('inputFile') inputFile!: ElementRef;
  @ViewChild(CdkTree) tree!: CdkTree<Carpeta>;

  data: Carpeta[] = [];

  dataSubject = new BehaviorSubject<Carpeta[]>(this.data);
  dataSource = this.dataSubject.asObservable();

  childrenAccessor = (dataNode: Carpeta) => dataNode.hijos ?? [];

  socios = [
    { id: 1, nombre: 'Socio 1', email: 'socio1@example.com', numero: '123' },
    { id: 2, nombre: 'Socio 2', email: 'socio2@example.com', numero: '124' },
    { id: 3, nombre: 'Socio 3', email: 'socio3@example.com', numero: '125' },
  ];

  sociosFiltrados = [...this.socios];

  contextMenuData: WPMedia | null = null;
  mostrarDialogoCrearCarpeta = false;
  nuevoNombreCarpeta = '';

  carpetasActuales: Carpeta[] = [];

  constructor(
    private readonly documentosService: DocumentosService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef, // Inyección de ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstructuraCarpetas();
    // Seleccionar la carpeta inicial por defecto
    const carpetaInicial = this.data[0]; // Por ejemplo, la primera carpeta
    if (carpetaInicial) {
      this.seleccionarCarpeta(carpetaInicial);
      // No es necesario llamar a cargarContenidoCarpeta(), ya que se llama dentro de seleccionarCarpeta()
    }
  }

  private cargarEstructuraCarpetas() {
    const data: Carpeta[] = [
      {
        nombre: 'Documentos Cooperativa',
        hijos: [
          {
            nombre: 'Documentos Generales',
            tipo: 'general',
            hijos: [],
            parent: null,
          },
          {
            nombre: 'Socios',
            hijos: [],
            parent: null,
          },
        ],
        parent: null,
      },
    ];

    // Agregar socios como subcarpetas dentro de "Socios"
    const sociosNode = data[0].hijos.find((carpeta) => carpeta.nombre === 'Socios');
    if (sociosNode) {
      sociosNode.hijos = this.sociosFiltrados.map((socio) => ({
        nombre: socio.nombre,
        tipo: 'socio',
        socioId: socio.id,
        hijos: [],
        parent: sociosNode,
      }));
      sociosNode.parent = data[0];
    }

    const documentosGeneralesNode = data[0].hijos.find((carpeta) => carpeta.nombre === 'Documentos Generales');
    if (documentosGeneralesNode) {
      documentosGeneralesNode.parent = data[0];
    }
    this.data = data;
    this.dataSubject.next(this.data); // Emit the new data
  }

  hasChild = (_: number, node: Carpeta) => !!node.hijos && node.hijos.length > 0;

  seleccionarCarpeta(node: Carpeta) {
    if (node) {
      this.carpetaSeleccionada = node;
      this.actualizarRuta(node);
      this.cargarContenidoCarpeta();
      this.documentoSeleccionado = [];
      this.carpetasSeleccionadas = [];
      this.todosSeleccionados = false;
    }
  }

  private actualizarRuta(node: Carpeta) {
    const ruta: Carpeta[] = [];
    let currentNode: Carpeta | null | undefined = node;
    while (currentNode) {
      ruta.unshift(currentNode);
      currentNode = currentNode.parent;
    }
    this.rutaActual = ruta;
  }

  private cargarContenidoCarpeta() {
    this.carpetasActuales = this.carpetaSeleccionada?.hijos || [];
    this.documentos = this.carpetaSeleccionada?.documentos || [];

    if (this.carpetaSeleccionada?.tipo === 'general') {
      this.documentosService
        .getMedia('all')
        .pipe(catchError(() => of([])))
        .subscribe((docs) => {
          this.carpetaSeleccionada!.documentos = [...(this.carpetaSeleccionada!.documentos || []), ...docs];
          this.documentos = this.carpetaSeleccionada!.documentos;
          this.cdr.detectChanges(); // Notificar a Angular del cambio
        });
    } else if (this.carpetaSeleccionada?.tipo === 'socio' && this.carpetaSeleccionada.socioId) {
      this.documentosService
        .getDocumentosSocio(this.carpetaSeleccionada.socioId)
        .pipe(catchError(() => of([])))
        .subscribe((docs) => {
          this.carpetaSeleccionada!.documentos = [...(this.carpetaSeleccionada!.documentos || []), ...docs];
          this.documentos = this.carpetaSeleccionada!.documentos;
          this.cdr.detectChanges(); // Notificar a Angular del cambio
        });
    }
  }

  cambiarVista(nuevaVista: 'grid' | 'list') {
    this.vista = nuevaVista;
  }

  buscarDocumento(event: any) {
    const termino = event.target.value.toLowerCase();
    if (this.carpetaSeleccionada) {
      this.documentos =
        this.carpetaSeleccionada.documentos?.filter((doc) => doc.title.rendered.toLowerCase().includes(termino)) || [];
      this.carpetasActuales =
        this.carpetaSeleccionada.hijos?.filter((carpeta) => carpeta.nombre.toLowerCase().includes(termino)) || [];
    }
  }

  toggleSeleccion(documento: WPMedia) {
    const index = this.documentoSeleccionado.indexOf(documento);
    if (index > -1) {
      this.documentoSeleccionado.splice(index, 1);
    } else {
      this.documentoSeleccionado.push(documento);
    }
  }

  toggleSeleccionCarpeta(carpeta: Carpeta) {
    const index = this.carpetasSeleccionadas.indexOf(carpeta);
    if (index > -1) {
      this.carpetasSeleccionadas.splice(index, 1);
    } else {
      this.carpetasSeleccionadas.push(carpeta);
    }
  }

  seleccionarTodo(event: any) {
    if (event.checked) {
      this.documentoSeleccionado = [...this.documentos];
      this.carpetasSeleccionadas = [...this.carpetasActuales];
      this.todosSeleccionados = true;
    } else {
      this.documentoSeleccionado = [];
      this.carpetasSeleccionadas = [];
      this.todosSeleccionados = false;
    }
  }

  abrirDocumento(documento: WPMedia | null) {
    if (documento) {
      window.open(documento.source_url, '_blank');
    }
  }

  abrirCarpeta(carpeta: Carpeta) {
    this.seleccionarCarpeta(carpeta);
  }

  eliminarDocumento(documento: WPMedia | null) {
    if (documento) {
      this.documentos = this.documentos.filter((doc) => doc !== documento);
      this.documentoSeleccionado = this.documentoSeleccionado.filter((doc) => doc !== documento);
    }
  }

  eliminarCarpeta(carpeta: Carpeta) {
    if (carpeta && this.carpetaSeleccionada) {
      this.carpetaSeleccionada.hijos = this.carpetaSeleccionada.hijos.filter((c) => c !== carpeta);
      this.carpetasActuales = this.carpetasActuales.filter((c) => c !== carpeta);
      this.updateTreeData();
    }
  }

  private updateTreeData() {
    // Guardar el estado de expansión de los nodos antes de actualizar el dataSource
    this.expandedNodeNames = new Set<string>();
    this.saveExpandedState(this.data);

    // Actualizar el dataSource sin crear una nueva instancia
    this.dataSubject.next(this.data);

    this.cdr.detectChanges();
    // Restaurar el estado de expansión de los nodos después de actualizar el dataSource
    this.restoreExpandedState(this.data);

    this.cdr.detectChanges();
  }

  private saveExpandedState(nodes: Carpeta[]) {
    nodes.forEach((node) => {
      if (this.isNodeExpanded(node)) {
        this.expandedNodeNames.add(node.nombre);
      }
      if (node.hijos && node.hijos.length > 0) {
        this.saveExpandedState(node.hijos);
      }
    });
  }

  private restoreExpandedState(nodes: Carpeta[]) {
    nodes.forEach((node) => {
      if (this.expandedNodeNames.has(node.nombre)) {
        this.expandNode(node);
      } else {
        this.collapseNode(node);
      }
      if (node.hijos && node.hijos.length > 0) {
        this.restoreExpandedState(node.hijos);
      }
    });
  }

  private expandNode(node: Carpeta) {
    this.expandedNodesSet.add(node);
  }

  private collapseNode(node: Carpeta) {
    this.expandedNodesSet.delete(node);
  }

  private isNodeExpanded(node: Carpeta): boolean {
    return this.expandedNodesSet.has(node);
  }

  eliminarSeleccion() {
    this.documentoSeleccionado.forEach((doc) => {
      this.eliminarDocumento(doc);
    });
    this.documentoSeleccionado = [];

    this.carpetasSeleccionadas.forEach((carpeta) => {
      this.eliminarCarpeta(carpeta);
    });
    this.carpetasSeleccionadas = [];
  }

  abrirDialogoCrearCarpeta() {
    const dialogRef = this.dialog.open(MakeFolderDialogComponent, {
      width: '300px',
      data: { nombreCarpeta: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.trim() !== '') {
        this.crearCarpeta(result);
      }
    });
  }
  crearCarpeta(nombreCarpeta: string) {
    const nuevaCarpeta: Carpeta = {
      nombre: nombreCarpeta,
      hijos: [],
      parent: this.carpetaSeleccionada,
      fechaModificacion: new Date(),
    };

    this.data = this.actualizarEstructuraCarpetas(this.carpetaSeleccionada, nuevaCarpeta);

    // Update carpetasActuales
    if (this.carpetaSeleccionada) {
      this.carpetaSeleccionada.hijos = [...(this.carpetaSeleccionada.hijos || []), nuevaCarpeta];
      this.carpetasActuales = this.carpetaSeleccionada.hijos;
    } else {
      this.data = [...this.data, nuevaCarpeta];
      this.carpetasActuales = this.data;
    }

    this.updateTreeData();
    this.cdr.detectChanges();
  }

  private actualizarEstructuraCarpetas(nodoPadre: Carpeta | null, nuevaCarpeta: Carpeta): Carpeta[] {
    if (nodoPadre === null) {
      // Estamos en la raíz
      return [...this.data, nuevaCarpeta];
    } else {
      // Recorremos la estructura y reemplazamos el nodo padre
      const actualizarNodo = (nodo: Carpeta): Carpeta => {
        if (nodo === nodoPadre) {
          return {
            ...nodo,
            hijos: [...(nodo.hijos || []), nuevaCarpeta],
          };
        } else if (nodo.hijos && nodo.hijos.length > 0) {
          return {
            ...nodo,
            hijos: nodo.hijos.map((hijo) => actualizarNodo(hijo)),
          };
        } else {
          return nodo;
        }
      };

      return this.data.map((nodo) => actualizarNodo(nodo));
    }
  }

  abrirDialogoSubirArchivo() {
    this.inputFile.nativeElement.click();
  }

  subirArchivo(event: any) {
    const archivos = event.target.files;
    if (archivos && archivos.length > 0) {
      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const nuevoDocumento: any = {
          id: Date.now(),
          title: { rendered: archivo.name },
          source_url: URL.createObjectURL(archivo),
          modified: new Date().toISOString(),
          // Otros campos necesarios
        };
        if (!this.carpetaSeleccionada?.documentos) {
          this.carpetaSeleccionada!.documentos = [];
        }
        if (this.carpetaSeleccionada !== null)
          this.carpetaSeleccionada.documentos = [...this.carpetaSeleccionada.documentos, nuevoDocumento];
      }
      if (this.carpetaSeleccionada?.documentos !== undefined) this.documentos = this.carpetaSeleccionada.documentos;
      this.cdr.detectChanges(); // Notificar a Angular del cambio
      this.inputFile.nativeElement.value = '';
    }
  }

  obtenerTipo(documento: WPMedia): string {
    const extension = documento.source_url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'doc':
      case 'docx':
        return 'Documento Word';
      case 'xls':
      case 'xlsx':
        return 'Hoja de cálculo Excel';
      default:
        return 'Archivo';
    }
  }

  navegarRuta(indice: number) {
    const carpeta = this.rutaActual[indice];
    if (carpeta) {
      this.seleccionarCarpeta(carpeta);
      this.rutaActual = this.rutaActual.slice(0, indice + 1);
    }
  }

  buscarSocio(event: any) {
    const valorBusqueda = event.target.value.toLowerCase();
    this.sociosFiltrados = this.socios.filter(
      (socio) =>
        socio.nombre.toLowerCase().includes(valorBusqueda) ||
        socio.email.toLowerCase().includes(valorBusqueda) ||
        socio.numero.includes(valorBusqueda),
    );

    this.cargarEstructuraCarpetas();
  }
}
