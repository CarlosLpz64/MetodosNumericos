import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface RowValues {
  position: number;
  xvalue: number;
  yvalue: number;
  result: number;
  errorabs: number;
}

const ELEMENT_DATA: RowValues[] = [
  {position: 1, xvalue: 1, yvalue: 1.0079, result: 2, errorabs: 1},
];

@Component({
  selector: 'app-euler',
  templateUrl: './euler.component.html',
  styleUrls: ['./euler.component.css']
})
export class EulerComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'xvalue', 'yvalue', 'result', 'errorabs'];
  displayedColumns: string[] = ['position', 'xvalue', 'yvalue'];
  dataSource: Array<RowValues> = [];
  myForm!: FormGroup;
  // Valores actuales
  nVal: number = 0;
  xVal: number = 0;
  yVal: number = 0;
  resultVal: number = 0;
  errorVal: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      funcion: ['0.4 * X * Y', [Validators.required, Validators.pattern(/^[0-9XY\+\-\*\/\s\.]*$/)]],
      condicionX: [1, [Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
      condicionY: [1, [Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
      paso: [0.1, [Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
      xnfinal: [5, [Validators.pattern(/^[0-9\.]*$/)]],
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
      this.resultVal = inicialY
      this.errorVal = this.yVal - this.resultVal
      this.dataSource.push({position: this.nVal, xvalue: this.xVal, yvalue: this.yVal, result: this.resultVal, errorabs: this.errorVal})
    } 
    // Siguientes clicks
    else {
      const paso = parseFloat(this.myForm.controls['paso'].value)
      this.xVal += paso
      this.yVal = this.calcularAproximado()
      this.resultVal = this.calcularReal()
      this.errorVal = this.calcularErrorAbsoluto(this.yVal - this.resultVal)
      this.dataSource.push({position: this.nVal, xvalue: this.xVal, yvalue: this.yVal, result: this.resultVal, errorabs: this.errorVal})
    }


    // Refrescar tabla
    this.nVal += 1
    this.dataSource = [...this.dataSource];
  }

  calcularAproximado() {
    const paso = parseFloat(this.myForm.controls['paso'].value)
    const Yn = this.dataSource[this.nVal-1].yvalue
    const Xn = this.dataSource[this.nVal-1].xvalue
    // Fórmula auxiliar Y' = 0.4xy
    return Yn + paso * (this.aplicarFuncion(Xn, Yn) + (this.aplicarFuncion(Xn+paso, this.calcularAsterisco())))/2
  }

  calcularAsterisco() {
    const paso = parseFloat(this.myForm.controls['paso'].value)
    const Yn = this.dataSource[this.nVal-1].yvalue
    const Xn = this.dataSource[this.nVal-1].xvalue
    // Fórmula auxiliar Y' = 0.4xy
    return Yn + paso * this.aplicarFuncion(Xn, Yn)
  }

  calcularReal() {
    const Xn = this.dataSource[this.nVal-1].xvalue
    const paso = parseFloat(this.myForm.controls['paso'].value)
    const XnActual = Xn + paso
    return Math.exp(-0.2 + 0.2 * Math.pow(XnActual, 2)); // Math.exp = e exponete
  }

  calcularErrorAbsoluto(val: number) {
    if (val < 0) { 
      return val * -1
    }
    return val
  }

  aplicarFuncion(x: number, y:number) {
    const textoFuncion = (this.myForm.controls['funcion'].value)
    var funcion = new Function('X', 'Y', 'return ' + textoFuncion);
    return funcion(x, y);
    //return 0.4 * x * y
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
