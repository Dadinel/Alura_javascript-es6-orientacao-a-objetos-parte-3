var ConnectionFactory = (function /*tmp*/() {
    const stores  = ['negociacoes'];
    const version = 5;
    const dbName  = 'aluraframe'

    var connection = null;
    var close      = null;

    return class ConnectionFactory {
        constructor() {
            throw new Error('Não é possível criar instâncias de ConnectionFactory');
        }

        static getConnection() {
            return new Promise((resolve, reject) => {
                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {
                    ConnectionFactory._createStores(e.target.result);
                };

                openRequest.onsuccess = e => {
                    if(!connection) {
                        connection = e.target.result;
                        close = connection.close.bind(connection);
                        connection.close = function() {
                            throw new Error('Você não pode fechar diretamente a conexão.');
                        }
                    }

                    resolve(connection);
                };

                openRequest.onerror = e => {
                    console.log(e.targer.error);
                    reject(e.target.erro.name);
                };
            });
        }

        static _createStores(connection_) {
            stores.forEach(store => {
                if(connection_.objectStoreNames.contains(store)) {
                    connection_.deleteObjectStore(store);
                }

                connection_.createObjectStore(store, { autoIncrement: true } );
            });
        }

        static closeConnection() {
            if(connection) {
                close();
                //Reflect.apply(close, connection, []); //Necessário sem o bind...
                connection = null;
                close = null;
            }
        }
    }
})(); //Função anônima com auto-invocação

//var ConnectionFactory = tmp();