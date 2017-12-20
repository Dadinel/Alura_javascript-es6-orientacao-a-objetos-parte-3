'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoController = function () {
    function NegociacaoController() {
        _classCallCheck(this, NegociacaoController);

        var $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._ordemaAtual = '';
        this._service = new NegociacaoService();

        this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

        this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');

        /*ConnectionFactory
            .getConnection()
            .then(connection => {
                new NegociacaoDao(connection)
                    .listaTodos()
                    .then(negociacoes => {
                        negociacoes.forEach(negociacao => {
                            this._listaNegociacoes.adiciona(negociacao);
                        })
                    })
                    .catch(erro => this._mensagem.texto = erro);
            })
            .catch(erro => this._mensagem.texto = erro);*/

        this._init();
    }

    _createClass(NegociacaoController, [{
        key: '_init',
        value: function _init() {
            var _this = this;

            /*ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(
                negociacoes => negociacoes.forEach(
                    negociacao => this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => this._mensagem.texto = erro);*/

            this._service.lista().then(function (negociacoes) {
                return negociacoes.forEach(function (negociacao) {
                    return _this._listaNegociacoes.adiciona(negociacao);
                });
            }).catch(function (erro) {
                return _this._mensagem.texto = erro;
            });

            setInterval(function () {
                _this.importaNegociacoes();
            }, 15000);
        }
    }, {
        key: 'adiciona',
        value: function adiciona(event) {
            var _this2 = this;

            event.preventDefault();

            var negociacao = this._criaNegociacao();

            this._service.cadastra(negociacao).then(function (mensagem) {
                _this2._listaNegociacoes.adiciona(negociacao);
                _this2._mensagem.texto = mensagem;
                _this2._limpaFormulario();
            }).catch(function (erro) {
                return _this2._mensagem.texto = erro;
            });

            /*ConnectionFactory.getConnection()
                .then( connection => {
                    let negociacao = this._criaNegociacao();
                     new NegociacaoDao(connection)
                        .adiciona(negociacao)
                        .then(() => {
                            this._listaNegociacoes.adiciona(negociacao);
                            this._mensagem.texto = 'Negociação adicionada com sucesso.'; 
                            this._limpaFormulario();
                        })
                        .catch((erro) => this._mensagem.texto = erro);
                });*/

            /*event.preventDefault();
            this._listaNegociacoes.adiciona(this._criaNegociacao());
            this._mensagem.texto = 'Negociação adicionada com sucesso'; 
            this._limpaFormulario();*/
        }
    }, {
        key: 'importaNegociacoes',
        value: function importaNegociacoes() {
            var _this3 = this;

            this._service.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
                return negociacoes.forEach(function (negociacao) {
                    _this3._listaNegociacoes.adiciona(negociacao);
                    _this3._mensagem.texto = 'Negociações do período importadas.';
                });
            }).catch(function (erro) {
                return _this3._mensagem.texto = erro;
            });

            /*this._service.obterNegociacoes()
                .then(negociacoes => negociacoes.filter( 
                    //negociacao => this._listaNegociacoes.negociacoes.indexOf(negociacao) == -1
                        negociacao => !this._listaNegociacoes.negociacoes.some(
                            negociacaoExistente => JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)
                        )
                    )
                )
                .then(negociacoes => negociacoes.forEach(negociacao => {
                    this._listaNegociacoes.adiciona(negociacao);
                    this._mensagem.texto = 'Negociações do período importadas.';
                }))
                .catch(erro => this._mensagem.texto = erro);*/
        }
    }, {
        key: 'apaga',
        value: function apaga() {
            var _this4 = this;

            /*this._listaNegociacoes.esvazia();
            this._mensagem.texto = 'Negociações apagadas com sucesso.';*/

            this._service.apaga().then(function (mensagem) {
                _this4._mensagem.texto = mensagem;
                _this4._listaNegociacoes.esvazia();
            }).catch(function (erro) {
                return _this4._mensagem.texto = erro;
            });

            /*ConnectionFactory.getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.apagaTodos())
                .then(mensagem => {
                    this._listaNegociacoes.esvazia();
                    this._mensagem.texto = mensagem;
                })
                .catch(erro => this._mensagem.texto = erro);*/
        }
    }, {
        key: '_criaNegociacao',
        value: function _criaNegociacao() {

            return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
        }
    }, {
        key: '_limpaFormulario',
        value: function _limpaFormulario() {

            this._inputData.value = '';
            this._inputQuantidade.value = 1;
            this._inputValor.value = 0.0;
            this._inputData.focus();
        }
    }, {
        key: 'ordena',
        value: function ordena(coluna) {
            if (coluna == this._ordemaAtual) {
                this._listaNegociacoes.inverteOrdem();
            } else {
                this._listaNegociacoes.ordena(function (a, b) {
                    return a[coluna] - b[coluna];
                });
            }
            this._ordemaAtual = coluna;
        }
    }]);

    return NegociacaoController;
}();
//# sourceMappingURL=NegociacaoController.js.map