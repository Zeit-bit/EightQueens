import { useEffect, useState } from "react";
import reina from "./assets/reina.webp";
import "./App.css";

function App() {
  const [estadoTablero, setEstadoTablero] = useState<number[][]>();
  const [soluciones, setSoluciones] = useState<number[][][]>([]);

  useEffect(() => {
    const estadoInicialTablero = CreateInitialArray();
    setEstadoTablero(estadoInicialTablero);
  }, []);

  function CreateInitialArray(): number[][] {
    const arregloInicial: number[][] = [];
    for (let i = 0; i < 8; i++) {
      // eslint-disable-next-line @typescript-eslint/no-array-constructor
      const arreglo = Array(8).fill(0);
      arregloInicial.push(arreglo);
    }
    return arregloInicial;
  }

  function Resolver8Reinas(todasLasSoluciones: boolean) {
    const tablero = CreateInitialArray();
    EightQueens([0,0], tablero, todasLasSoluciones);
  }

  function EightQueens(
    posicionReina: number[] = [0, 0],
    tablero: number[][] = CrearTablero(),
    todasLasSoluciones: boolean,
    nSoluciones: number[] = [0]
  ): boolean {
    while (EstaSiendoAtacada(posicionReina, tablero)) {
      posicionReina[1]++;
      if (posicionReina[1] > 7) {
        return false;
      }
    }
  
    tablero[posicionReina[0]][posicionReina[1]] = 1;
  
    if (posicionReina[0] === 7) {
      for (let i = 0; i < 8; i++) {
        if (tablero[7][i] === 1) {
          nSoluciones[0]++;
          console.log(`Solucion #${nSoluciones[0]}`);
          console.log(tablero);
          AgregarSolucion(tablero);
          if (!todasLasSoluciones) {
            return true;
          }
          if (nSoluciones[0] === 92) {
            return true;
          } else {
            tablero[posicionReina[0]][posicionReina[1]] = 0;
          }
  
          return false;
        }
      }
    }
  
    while (!EightQueens([posicionReina[0] + 1, 0], tablero, todasLasSoluciones, nSoluciones)) {
      tablero[posicionReina[0]][posicionReina[1]] = 0;
      if (posicionReina[1] >= 7) {
        return false;
      }
      if (posicionReina[1] != 7) posicionReina[1]++;
      while (EstaSiendoAtacada(posicionReina, tablero)) {
        posicionReina[1]++;
        if (posicionReina[1] > 7) {
          return false;
        }
      }
      tablero[posicionReina[0]][posicionReina[1]] = 1;
    }
    return true;
  }
  
  function EstaSiendoAtacada(posicionReina: number[], tablero: number[][]) {
    // Recorre la recta de la columna en la que se encuentra la reina
    for (let i = 0; i < 8; i++) {
      if (tablero[i][posicionReina[1]] === 1 && i != posicionReina[0]) {
        return true;
      }
    }
  
    // Recorre la diagonal superior izquierda con respecto a la posicion de la reina
    for (let i = 0; posicionReina[0] - i >= 0 && posicionReina[1] - i >= 0; i++) {
      if (tablero[posicionReina[0] - i][posicionReina[1] - i] === 1) {
        return true;
      }
    }
  
    // Recorre la diagonal superior derecha con respecto a la posicion de la reina
    for (let i = 0; posicionReina[0] - i >= 0 && posicionReina[1] + i >= 0; i++) {
      if (tablero[posicionReina[0] - i][posicionReina[1] + i] === 1) {
        return true;
      }
    }
  
    return false;
  }
  
  function CrearTablero() {
    const tablero: number[][] = [];
    for (let i: number = 0; i < 8; i++) {
      tablero.push([]);
    }
    for (let i: number = 0; i < 8; i++) {
      for (let j: number = 0; j < 8; j++) {
        tablero[i].push(0);
      }
    }
    return tablero;
  }

  function AgregarSolucion(estadoTableroSolucion: number[][]) {
    const nuevaSolucion: number[][] = [];
    estadoTableroSolucion.forEach((fila) => {
      nuevaSolucion.push([...fila]);
    });
    setSoluciones((soluciones) => {
      const nuevasSoluciones = [...soluciones];
      nuevasSoluciones.push(nuevaSolucion);
      return nuevasSoluciones;
    });
  }

  return (
    <div>
      <div>
        <button onClick={() => Resolver8Reinas(false)}>
          Resolver 8 Reinas (1 solucion)
        </button>
        <button onClick={() => Resolver8Reinas(true)}>
          Resolver 8 Reinas (todas las soluciones)
        </button>
      </div>
      <div className="game_zone">
        <div className="tablero">
          {estadoTablero?.map((filaTablero, index) => {
            return (
              <FilaTablero
                esPar={index % 2 === 0}
                informacionFila={filaTablero}
              />
            );
          })}
        </div>
        <div className="solutions">
          <h3 style={{ color: "black", backgroundColor: "gainsboro" }}>
            Soluciones
          </h3>
          {soluciones.map((solucion, index) => {
            return (
              <button
                className="solucion_button"
                onClick={() => setEstadoTablero(solucion)}
              >
                Solucion {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface CuadradoProps {
  color: ColoresCuadrado;
  valor: number | null;
}
enum ColoresCuadrado {
  blanco,
  negro,
}

function Cuadrado({ color, valor }: CuadradoProps) {
  const clase = color === ColoresCuadrado.blanco ? "blanco" : "negro";
  return (
    <div className={`cuadrado ${clase}`}>
      {valor ? <img width={60} src={reina} /> : null}
    </div>
  );
}

interface FilaTableroProps {
  esPar: boolean;
  informacionFila: (number | null)[];
}
function FilaTablero({ esPar, informacionFila }: FilaTableroProps) {
  return (
    <div className="filaTablero">
      {informacionFila.map((elemento, index) => {
        return (
          <Cuadrado
            color={
              (!esPar && index % 2 === 0) || (esPar && index % 2 !== 0)
                ? ColoresCuadrado.blanco
                : ColoresCuadrado.negro
            }
            valor={elemento}
          />
        );
      })}
    </div>
  );
}

export default App;
