import requests
import time

# 1. Definimos la dirección exacta de nuestra API de Express
URL = "http://localhost:3000/api/lotes"

# 2. Lista con lotes simulados que la planta registrará de forma automática
lotes_a_registrar = [
    {
        "codigo_lote": "LOTE-MANE-2026-002",
        "formula": "Esencia Lavanda Alpina",
        "cantidad_litros": 300.00,
        "linea_id": 1
    },
    {
        "codigo_lote": "LOTE-MANE-2026-003",
        "formula": "Concentrado Cítrico Limón-Verbena",
        "cantidad_litros": 750.25,
        "linea_id": 2
    }
]

def registrar_lotes():
    print("🤖 Iniciando automatización de registro de lotes hacia la API...\n")
    
    # Recorremos uno por uno los lotes de nuestra lista
    for lote in lotes_a_registrar:
        try:
            # 3. Hacemos la petición POST enviando el diccionario directamente en formato JSON
            respuesta = requests.post(URL, json=lote)
            
            # 4. Verificamos si la API respondió con éxito (código 201 Created)
            if respuesta.status_code == 201:
                datos = respuesta.json()
                print(f"✅ [ÉXITO] Lote registrado: {lote['codigo_lote']} -> {datos.get('message')}")
            else:
                # Si hubo algún error controlado (ej. lote duplicado), mostramos el mensaje
                print(f"⚠️ [AVISO] El lote {lote['codigo_lote']} no se registró: {respuesta.json().get('message')}")
                
        except requests.exceptions.ConnectionError:
            print("❌ [ERROR CRÍTICO] No se pudo conectar con el servidor. ¿Aseguraste que 'node index.js' está encendido?")
            break
        
        # 5. Pausa de 1 segundo entre cada petición para simular un intervalo real
        time.sleep(1)

    print("\n🏁 Proceso de automatización finalizado.")

if __name__ == "__main__":
    registrar_lotes()
