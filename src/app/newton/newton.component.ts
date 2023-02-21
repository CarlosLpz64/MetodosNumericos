import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface RowValues {
  position: number;
  xvalue: number;
  funVal: number;
  derVal: number;
}

@Component({
  selector: 'app-newton',
  templateUrl: './newton.component.html',
  styleUrls: ['./newton.component.css']
})
export class NewtonComponent {
displayedColumns: string[] = ['position', 'xvalue', 'funVal', 'derVal'];
dataSource: Array<RowValues> = [];
myForm!: FormGroup;
// Valores actuales
nVal: number = 0;
xVal: number = 0;
funVal: number = 0;
derVal: number = 0;

constructor(private fb: FormBuilder) {}

ngOnInit(): void {
  this.myForm = this.fb.group({
    funcion: ['X*X*X - 3*X*X - 5*X + 2', [Validators.required, Validators.pattern(/^[0-9X\+\-\*\/\s\.]*$/)]],
    derivada: ['3*X*X - 6*X -5', [Validators.required, Validators.pattern(/^[0-9X\+\-\*\/\s\.]*$/)]],
    condicionX: [2, [Validators.required, Validators.pattern(/^[0-9\.]*$/)]],
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
  let ciclos:number = 0;
  const xnFinal = parseFloat(this.myForm.controls['xnfinal'].value); //decimales
  let dataSize = this.dataSource.length

  let valX = dataSize ? this.dataSource[dataSize-1].xvalue : 0
  let valXAnt = dataSize > 1 ? this.dataSource[dataSize-2].xvalue : -1

  this.calcular()
  console.log(valX.toFixed(xnFinal))


  while (valXAnt.toFixed(xnFinal) != valX.toFixed(xnFinal) && ciclos < 200) {
    this.calcular()
    dataSize = this.dataSource.length
    valX = dataSize ? this.dataSource[dataSize-1].xvalue : 0
    valXAnt = dataSize > 1 ? this.dataSource[dataSize-2].xvalue : -1
    ciclos += 1;
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
    this.xVal = inicialX
    this.funVal = this.aplicarFuncion(this.xVal)
    this.derVal = this.aplicarDerivada(this.xVal)
    this.dataSource.push({position: this.nVal, xvalue: this.xVal, funVal: this.funVal, derVal: this.derVal})
  } 
  // Siguientes clicks
  else {
    const inicialX = parseFloat(this.myForm.controls['condicionX'].value);
    this.xVal = this.iteracionX()
    this.funVal = this.aplicarFuncion(this.xVal)
    this.derVal = this.aplicarDerivada(this.xVal)
    this.dataSource.push({position: this.nVal, xvalue: this.xVal, funVal: this.funVal, derVal: this.derVal})
  }


  // Refrescar tabla
  this.nVal += 1
  this.dataSource = [...this.dataSource];
}

aplicarFuncion(x: number) {
  const textoFuncion = (this.myForm.controls['funcion'].value)
  var funcion = new Function('X', 'return ' + textoFuncion);
  return funcion(x);
}

aplicarDerivada(x: number) {
  const textoFuncion = (this.myForm.controls['derivada'].value)
  var funcion = new Function('X', 'return ' + textoFuncion);
  return funcion(x);
}

  iteracionX(){
    return this.xVal - this.funVal / this.derVal
  }

  validarFuncion() {
    try {
      const textoFuncion = (this.myForm.controls['funcion'].value)
      var funcion = new Function('X', 'return ' + textoFuncion);
      funcion(1);
      return true
    } catch (error) {
      alert("Función ingresada no válida")
      return false
    }
  }
  validarDerivada() {
    try {
      const textoFuncion = (this.myForm.controls['derivada'].value)
      var funcion = new Function('X', 'return ' + textoFuncion);
      funcion(1);
      return true
    } catch (error) {
      alert("Derivada ingresada no válida")
      return false
    }
  }
}
