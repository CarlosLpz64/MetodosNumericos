import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface RowValues {
  position: number;
  xvalue: number;
  yvalue: number;
  k1: number;
  k2: number;
  k3: number;
  k4: number;
}

const ELEMENT_DATA: RowValues[] = [
  {position: 1, xvalue: 1, yvalue: 1.0079, k1: 2, k2: 1, k3: 2, k4: 1},
];


@Component({
  selector: 'app-runge',
  templateUrl: './runge.component.html',
  styleUrls: ['./runge.component.css']
})
export class RungeComponent {
  // displayedColumns: string[] = ['position', 'xvalue', 'yvalue', 'result', 'errorabs'];
  displayedColumns: string[] = ['position', 'xvalue', 'yvalue', 'k1', 'k2', 'k3', 'k4'];
  dataSource: Array<RowValues> = [];
  myForm!: FormGroup;
  // Valores actuales
  nVal: number = 0;
  xVal: number = 0;
  yVal: number = 0;
  k1: number = 0;
  k2: number = 0;
  k3: number = 0;
  k4: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      funcion: ['-20 * Y + 7 * Math.exp(-0.5 * X)', [Validators.required]], // Validators.pattern(/^[0-9XY\+\-\*\/\s\.]*$/)
      condicionX: [0, [Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
      condicionY: [5, [Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
      paso: [0.01, [Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
      xnfinal: [0.5, [Validators.pattern(/^[0-9\.]*$/)]],
      iteraciones: [50, [Validators.min(1)]],
    });
  }

  calcularNVeces(): void {
    const iteraciones = parseInt(this.myForm.controls['iteraciones'].value);
    for (let i = 0; i <= iteraciones; i++) {
      this.calcular()
    }
  }

  calcularXnFinal(): void {
    const xnFinal = parseFloat(this.myForm.controls['xnfinal'].value);
    let dataSize = this.dataSource.length
    let valX = dataSize ? this.dataSource[dataSize-1].xvalue : 0
    if (xnFinal < valX) {
      alert("Por favor inserte un valor mayor a X")
      return
    }

    while (xnFinal > valX) {
      this.calcular()
      dataSize = this.dataSource.length
      valX = this.dataSource[dataSize-1].xvalue
    }
  }

  calcular(): void{
    // Validar
    if(!this.validarFuncion()) {
      return
    }
    // Primer Click
    if (!this.nVal) {
      const inicialX = parseFloat(this.myForm.controls['condicionX'].value);
      const inicialY = parseFloat(this.myForm.controls['condicionY'].value);
      this.xVal = inicialX
      this.yVal = inicialY
      this.k1 = this.aplicarFuncion(this.xVal, this.yVal)
      this.k2 = this.aplicarFuncion(this.aplicarAumentoX(this.xVal), this.aplicarAumentoY(this.yVal,this.k1))
      this.k3 = this.aplicarFuncion(this.aplicarAumentoX(this.xVal), this.aplicarAumentoY(this.yVal,this.k2))
      this.k4 = this.aplicarFuncion(this.aplicarAumentoXOrden4(this.xVal), this.aplicarAumentoYOrden4(this.yVal,this.k3))
      this.dataSource.push({position: this.nVal, xvalue: this.xVal, yvalue: this.yVal, k1: this.k1, k2: this.k2, k3: this.k3, k4: this.k4})
    } 
    // Siguientes clicks
    else {
      const paso = parseFloat(this.myForm.controls['paso'].value)
      this.xVal += paso
      this.yVal = this.calcularY()
      this.k1 = this.aplicarFuncion(this.xVal, this.yVal)
      this.k2 = this.aplicarFuncion(this.aplicarAumentoX(this.xVal), this.aplicarAumentoY(this.yVal,this.k1))
      this.k3 = this.aplicarFuncion(this.aplicarAumentoX(this.xVal), this.aplicarAumentoY(this.yVal,this.k2))
      this.k4 = this.aplicarFuncion(this.aplicarAumentoXOrden4(this.xVal), this.aplicarAumentoYOrden4(this.yVal,this.k3))
      this.dataSource.push({position: this.nVal, xvalue: this.xVal, yvalue: this.yVal, k1: this.k1, k2: this.k2, k3: this.k3, k4: this.k4})
    }


    // Refrescar tabla
    this.nVal += 1
    this.dataSource = [...this.dataSource];
  }

  aplicarAumentoX(val: number) {
    const paso = parseFloat(this.myForm.controls['paso'].value)
    return val + paso / 2
  }

  aplicarAumentoY(val: number, k:number) {
    const paso = parseFloat(this.myForm.controls['paso'].value)
    return val + k * paso / 2
  }

  aplicarAumentoXOrden4(val: number) {
    const paso = parseFloat(this.myForm.controls['paso'].value)
    return val + paso
  }

  aplicarAumentoYOrden4(val: number, k:number) {
    const paso = parseFloat(this.myForm.controls['paso'].value)
    return val + k * paso
  }

  aplicarFuncion(x: number, y:number) {
    const textoFuncion = (this.myForm.controls['funcion'].value)
    var funcion = new Function('X', 'Y', 'return ' + textoFuncion);
    return funcion(x, y);
  }

  calcularY(){
    const paso = parseFloat(this.myForm.controls['paso'].value)
    return this.yVal + (paso / 6) * (this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4)
  }

  validarFuncion() {
    try {
      const textoFuncion = (this.myForm.controls['funcion'].value)
      var funcion = new Function('X', 'Y', 'return ' + textoFuncion);
      funcion(1, 1);
      return true
    } catch (error) {
      alert("Función ingresada no válida")
      return false
    }
  }
}
