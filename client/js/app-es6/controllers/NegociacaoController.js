import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Negociacao} from '../models/Negociacao';
import {Mensagem} from '../models/Mensagem';
import {NegociacaoService} from '../services/NegociacaoService';
import {NegociacoesView} from '../views/NegociacoesView';
import {MensagemView} from '../views/MensagemView';
import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';

export class NegociacaoController {
    
    constructor() {
        
        let $ = document.querySelector.bind(document);
        
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._ordemaAtual = '';
        this._service = new NegociacaoService();
         
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(), 
            new NegociacoesView($('#negociacoesView')), 
            'adiciona', 'esvazia', 'ordena', 'inverteOrdem');
       
        this._mensagem = new Bind(
            new Mensagem(), new MensagemView($('#mensagemView')),
            'texto');

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

    _init() {
        /*ConnectionFactory
        .getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.listaTodos())
        .then(
            negociacoes => negociacoes.forEach(
                negociacao => this._listaNegociacoes.adiciona(negociacao)))
        .catch(erro => this._mensagem.texto = erro);*/

        this._service.lista()
            .then(negociacoes => negociacoes.forEach(
                negociacao => this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => this._mensagem.texto = erro );

        setInterval( () => {
            this.importaNegociacoes();
        }, 15000 );
    }

    adiciona(event) {
        event.preventDefault();

        let negociacao = this._criaNegociacao();

        this._service.cadastra(negociacao)
            .then(mensagem => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();
            })
            .catch(erro => this._mensagem.texto = erro);

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
    
    importaNegociacoes() {
        this._service.importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas.';
            }))
            .catch(erro => this._mensagem.texto = erro);

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

    apaga() {
        
        /*this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociações apagadas com sucesso.';*/

        this._service.apaga()
            .then( mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(erro => this._mensagem.texto = erro);

        /*ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = mensagem;
            })
            .catch(erro => this._mensagem.texto = erro);*/
    }
    
    _criaNegociacao() {
        
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value));
    }
    
    _limpaFormulario() {
     
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();   
    }

    ordena(coluna) {
        if(coluna == this._ordemaAtual) {
            this._listaNegociacoes.inverteOrdem()
        }
        else {
            this._listaNegociacoes.ordena((a,b) => a[coluna] - b[coluna]);
        }
        this._ordemaAtual = coluna;
    }
}