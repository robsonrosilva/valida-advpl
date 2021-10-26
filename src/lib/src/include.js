"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Include = void 0;
const Erro_1 = require("./models/Erro");
class Include {
    constructor(local) {
        this.local = local;
        this.includesObsoletos = [];
        this.includesObsoletos.push('PROTHEUS.CH');
        this.includesObsoletos.push('DIALOG.CH');
        this.includesObsoletos.push('FONT.CH');
        this.includesObsoletos.push('PTMENU.CH');
        this.includesObsoletos.push('PRINT.CH');
        this.includesObsoletos.push('COLORS.CH');
        this.includesObsoletos.push('FOLDER.CH');
        this.includesObsoletos.push('MSOBJECT.CH');
        this.includesObsoletos.push('VKEY.CH');
        this.includesObsoletos.push('WINAPI.CH');
        this.includesObsoletos.push('FWCOMMAND.CH');
        this.includesObsoletos.push('FWCSS.CH');
        this.includeExpressoes = [];
        //AP5MAIL.CH
        this.includeExpressoes.push({
            expressoes: [
                /CONNECT(\ |\t)+SMTP(\ |\t)+SERVER/gim,
                /CONNECT(\ |\t)+POP(\ |\t)+SERVER/gim,
                /DISCONNECT(\ |\t)+SMTP(\ |\t)+SERVER/gim,
                /DISCONNECT(\ |\t)+POP(\ |\t)+SERVER/gim,
                /POP(\ |\t)+MESSAGE(\ |\t)+COUNT/gim,
                /SEND(\ |\t)+MAIL(\ |\t)+FROM/gim,
                /GET(\ |\t)+MAIL(\ |\t)+ERROR/gim,
                /RECEIVE(\ |\t)+MAIL(\ |\t)+MESSAGE/gim,
            ],
            include: 'AP5MAIL.CH',
            precisa: false,
            includes: [],
        });
        //APVISIO.CH
        //APWEB.CH
        this.includeExpressoes.push({
            expressoes: [
                /APWEB+(\ |\t)+INIT(\ |\t)+.+(\ |\t)+USING/gim,
                /APWEB+(\ |\t)+END/gim,
            ],
            include: 'APWEB.CH',
            precisa: false,
            includes: [],
        });
        //APWEBEX.CH
        this.includeExpressoes.push({
            expressoes: [
                /OPEN+(\ |\t)+QUERY(\ |\t)+ALIAS/gim,
                /CLOSE+(\ |\t)+QUERY/gim,
                /WEB+(\ |\t)+EXTENDED(\ |\t)+INIT/gim,
                /WEB+(\ |\t)+EXTENDED(\ |\t)+END/gim,
            ],
            include: 'APWEBEX.CH',
            precisa: false,
            includes: [],
        });
        //APWEBSRV.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+SOAPFAULT_VERSIONMISMATCH/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_MUSTUNDERSTAND/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_DTDNOTSUPPORTED/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_DATAENCODINGUNKNOWN/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_SENDER/gim,
                /(\ |\t|\(|\,)+SOAPFAULT_RECEIVER/gim,
                /(\ |\t|\(|\,)+BYREF/gim,
                /(^|\t|\ )+WSSTRUCT/gim,
                /(^|\t|\ )+WSSERVICE/gim,
                /(^|\t|\ )+WSCLIENT/gim,
            ],
            include: 'APWEBSRV.CH',
            precisa: false,
            includes: [],
        });
        //APWIZARD.CH
        this.includeExpressoes.push({
            expressoes: [
                /DEFINE+(\ |\t)+WIZARD/gim,
                /ACTIVATE+(\ |\t)+WIZARD/gim,
                /CREATE+(\ |\t)+PANEL/gim,
            ],
            include: 'APWIZARD.CH',
            precisa: false,
            includes: [],
        });
        //AVPRINT.CH
        //AXSDEF.CH
        //BIRTDATASET.CH
        //COLORS.CH - DENTRO DO PROTHEUS.CH
        //COMMON.CH
        //CONSTANT.CH
        //DBFCDXAX.CH
        //TOPCONN.CH
        this.includeExpressoes.push({
            expressoes: [/TCQUERY+(\ |\t)/gim],
            include: 'TOPCONN.CH',
            precisa: false,
            includes: [],
        });
        //TBICONN.CH
        this.includeExpressoes.push({
            expressoes: [
                /CREATE(\ |\t)+RPCCONN(\ |\t)/gim,
                /CLOSE(\ |\t)+RPCCONN(\ |\t)/gim,
                /PREPARE(\ |\t)+ENVIRONMENT(\ |\t)/gim,
                /RESET(\ |\t)+ENVIRONMENT(\ |\t)/gim,
                /OPEN(\ |\t)+REMOTE(\ |\t)+TRANSACTION+(\ |\t)/gim,
                /CLOSE(\ |\t)+REMOTE(\ |\t)+TRANSACTION+(\ |\t)/gim,
                /CALLPROC(\ |\t)+IN(\ |\t)/gim,
                /OPEN(\ |\t)+REMOTE(\ |\t)+TABLES(\ |\t)/gim,
            ],
            include: 'TBICONN.CH',
            precisa: false,
            includes: ['AP5MAIL.CH'],
        });
        //REPORT.CH
        this.includeExpressoes.push({
            expressoes: [
                /DEFINE+(\ |\t)+REPORT(\ |\t)+.+(\ |\t)+NAME(\ |\t)/gim,
                /DEFINE+(\ |\t)+SECTION(\ |\t)+.+(\ |\t)+OF(\ |\t)/gim,
                /DEFINE+(\ |\t)+CELL(\ |\t)+NAME(\ |\t)+.+(\ |\t)+OF(\ |\t)/gim,
                /DEFINE+(\ |\t)+BREAK(\ |\t)+OF(\ |\t)/gim,
                /DEFINE+(\ |\t)+FUNCTION(\ |\t)+FROM(\ |\t)/gim,
                /DEFINE+(\ |\t)+COLLECTION(\ |\t)+.+(\ |\t)+OF(\ |\t)/gim,
                /DEFINE+(\ |\t)+BORDER(\ |\t)+.+(\ |\t)+OF(\ |\t)+/gim,
                /DEFINE+(\ |\t)+HEADER(\ |\t)+BORDER+(\ |\t)+.+(\ |\t)+OF(\ |\t)/gim,
                /DEFINE+(\ |\t)+CELL(\ |\t)+BORDER(\ |\t)+.+(\ |\t)+OF(\ |\t)/gim,
                /DEFINE+(\ |\t)+CELL(\ |\t)+HEADER(\ |\t)+BORDER(\ |\t)+.+(\ |\t)+OF(\ |\t)/gim,
            ],
            include: 'REPORT.CH',
            precisa: false,
            includes: [],
        });
        //RESTFUL.CH
        this.includeExpressoes.push({
            expressoes: [
                /(^|\t|\ )+WSRESTFUL/gim,
                /(^|\t|\ )+WADL/gim,
                /(^|\t|\ )+WADLMETHOD/gim,
            ],
            include: 'RESTFUL.CH',
            precisa: false,
            includes: ['APWEBSRV.CH'],
        });
        //FILEIO.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+F_ERROR/gim,
                /(\ |\t|\(|\,)+FS_SET/gim,
                /(\ |\t|\(|\,)+FS_RELATIVE/gim,
                /(\ |\t|\(|\,)+FS_END/gim,
                /(\ |\t|\(|\,)+FO_READ/gim,
                /(\ |\t|\(|\,)+FO_WRITE/gim,
                /(\ |\t|\(|\,)+FO_READWRITE/gim,
                /(\ |\t|\(|\,)+FO_COMPAT/gim,
                /(\ |\t|\(|\,)+FO_EXCLUSIVE/gim,
                /(\ |\t|\(|\,)+FO_DENYWRITE/gim,
                /(\ |\t|\(|\,)+FO_DENYREAD/gim,
                /(\ |\t|\(|\,)+FO_DENYNONE/gim,
                /(\ |\t|\(|\,)+FO_SHARED/gim,
                /(\ |\t|\(|\,)+FC_NORMAL/gim,
                /(\ |\t|\(|\,)+FC_READONLY/gim,
                /(\ |\t|\(|\,)+FC_HIDDEN/gim,
                /(\ |\t|\(|\,)+FC_SYSTEM/gim,
                /(\ |\t|\(|\,)+FD_RAW/gim,
                /(\ |\t|\(|\,)+FD_BINARY/gim,
                /(\ |\t|\(|\,)+FD_COOKED/gim,
                /(\ |\t|\(|\,)+FD_TEXT/gim,
                /(\ |\t|\(|\,)+FD_ASCII/gim,
            ],
            include: 'FILEIO.CH',
            precisa: false,
            includes: [],
        });
        //TBICODE.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+RPC_LOGIN/gim,
                /(\ |\t|\(|\,)+RPC_LOGOFF/gim,
                /(\ |\t|\(|\,)+RPC_SEND_COTACAO/gim,
                /(\ |\t|\(|\,)+RPC_ESTORNA_COTACAO/gim,
                /(\ |\t|\(|\,)+RPC_READ_COTACAO/gim,
                /(\ |\t|\(|\,)+RPC_SEND_ORCAMENTO/gim,
                /(\ |\t|\(|\,)+RPC_ESTORNA_ORCAMENTO/gim,
                /(\ |\t|\(|\,)+RPC_READ_ORCAMENTO/gim,
            ],
            include: 'TBICODE.CH',
            precisa: false,
            includes: [],
        });
        //PARMTYPE.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+PARAMEXCEPTION/gim,
                /(\ |\t|\(|\,)+CLASSEXCEPTION/gim,
                /(\ |\t|\(|\,)+CLASSPARAMEXCEPTION/gim,
                /(\ |\t|\(|\,)+BLOCKPARAMEXCEPTION/gim,
                /(\ |\t|\(|\,)+PARAMTYPE/gim,
            ],
            include: 'PARMTYPE.CH',
            precisa: false,
            includes: [],
        });
        //FWMVCDEF.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+FORM_STRUCT_TABLE_/gim,
                /(\ |\t|\(|\,)+FORM_STRUCT_CARGO_/gim,
                /(\ |\t|\(|\,)+MVC_BUTTON_/gim,
                /(\ |\t|\(|\,)+MVC_TOOLBAR_/gim,
                /(\ |\t|\(|\,)+MODELO_PK_/gim,
                /(\ |\t|\(|\,)+MODEL_TRIGGER_/gim,
                /(\ |\t|\(|\,)+MODEL_FIELD_/gim,
                /(\ |\t|\(|\,)+MODEL_RELATION_/gim,
                /(\ |\t|\(|\,)+MODEL_STRUCT_/gim,
                /(\ |\t|\(|\,)+STRUCT_FEATURE_/gim,
                /(\ |\t|\(|\,)+STRUCT_RULES_/gim,
                /(\ |\t|\(|\,)+MODEL_GRID_/gim,
                /(\ |\t|\(|\,)+MODEL_GRIDLINE_/gim,
                /(\ |\t|\(|\,)+MODEL_RULES_/gim,
                /(\ |\t|\(|\,)+MODEL_MSGERR_/gim,
                /(\ |\t|\(|\,)+MODEL_OPERATION_/gim,
                /(\ |\t|\(|\,)+MVC_LOADFILTER_/gim,
                /(\ |\t|\(|\,)+MODEL_CONTROL_/gim,
                /(\ |\t|\(|\,)+VIEWS_VIEW_/gim,
                /(\ |\t|\(|\,)+MVC_VIEW_/gim,
                /(\ |\t|\(|\,)+MVC_MODEL_/gim,
                /(\ |\t|\(|\,)+FORMSTRUFIELD/gim,
                /(\ |\t|\(|\,)+FORMSTRUTRIGGER/gim,
                /(\ |\t|\(|\,)+VIEWSTRUFIELD/gim,
                /(\ |\t|\(|\,)+VIEWSTRUFOLDER/gim,
                /(\ |\t|\(|\,)+VIEWSTRUDOCKWINDOW/gim,
                /(\ |\t|\(|\,)+VIEWSTRUGROUP/gim,
                /(\ |\t|\(|\,)+VIEW_BUTTON_/gim,
                /(\ |\t|\(|\,)+OP_PESQUISAR/gim,
                /(\ |\t|\(|\,)+OP_VISUALIZAR/gim,
                /(\ |\t|\(|\,)+OP_INCLUIR/gim,
                /(\ |\t|\(|\,)+OP_ALTERAR/gim,
                /(\ |\t|\(|\,)+OP_EXCLUIR/gim,
                /(\ |\t|\(|\,)+OP_IMPRIMIR/gim,
                /(\ |\t|\(|\,)+OP_COPIA/gim,
                /(^|\t|\ )+ADD(\ |\t)+FWTOOLBUTTON/gim,
                /(^|\t|\ )+NEW(\ |\t)+MODEL/gim,
                /(^|\t|\ )+PUBLISH(\ |\t)+(USER(\ |\t)+)*MODEL(\ |\t)+REST(\ |\t)+NAME/gim,
                /(^|\t|\ )+ADD(\ |\t)+OPTION(\ |\t)+(.|)+(\ |\t|)+TITLE(\ |\t|)+(.|)+(\ |\t|)+ACTION(\ |\t)+(.|)+(\ |\t|)+OPERATION(\ |\t)+(.|)+(\ |\t)+ACCESS/gim,
            ],
            include: 'FWMVCDEF.CH',
            precisa: false,
            includes: ['PARMTYPE.CH', 'FWMBROWSE.CH'],
        });
        //AARRAY.CH
        this.includeExpressoes.push({
            expressoes: [/\[+(\ |\t|)+\#+(.|)+\]/gim],
            include: 'AARRAY.CH',
            precisa: false,
            includes: [],
        });
        //RPTDEF.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+CELL_ALIGN_LEFT/gim,
                /(\ |\t|\(|\,)+CELL_ALIGN_CENTER/gim,
                /(\ |\t|\(|\,)+CELL_ALIGN_RIGHT/gim,
                /(\ |\t|\(|\,)+BORDER_NONE/gim,
                /(\ |\t|\(|\,)+BORDER_CONTINUOUS/gim,
                /(\ |\t|\(|\,)+BORDER_PARENT/gim,
                /(\ |\t|\(|\,)+BORDER_HEADERPARENT/gim,
                /(\ |\t|\(|\,)+BORDER_CELL/gim,
                /(\ |\t|\(|\,)+BORDER_FUNCTION/gim,
                /(\ |\t|\(|\,)+BORDER_SECTION/gim,
                /(\ |\t|\(|\,)+EDGE_TOP/gim,
                /(\ |\t|\(|\,)+EDGE_BOTTOM/gim,
                /(\ |\t|\(|\,)+EDGE_LEFT/gim,
                /(\ |\t|\(|\,)+EDGE_RIGHT/gim,
                /(\ |\t|\(|\,)+EDGE_ALL/gim,
                /(\ |\t|\(|\,)+NEGATIVE_PARENTHESES/gim,
                /(\ |\t|\(|\,)+NEGATIVE_SIGNAL/gim,
                /(\ |\t|\(|\,)+IMP_DISCO/gim,
                /(\ |\t|\(|\,)+IMP_SPOOL/gim,
                /(\ |\t|\(|\,)+IMP_EMAIL/gim,
                /(\ |\t|\(|\,)+IMP_EXCEL/gim,
                /(\ |\t|\(|\,)+IMP_HTML/gim,
                /(\ |\t|\(|\,)+IMP_PDF/gim,
                /(\ |\t|\(|\,)+IMP_ODF/gim,
                /(\ |\t|\(|\,)+IMP_PDFMAIL/gim,
                /(\ |\t|\(|\,)+IMP_MAILCOMPROVA/gim,
                /(\ |\t|\(|\,)+IMP_ECM/gim,
                /(\ |\t|\(|\,)+AMB_SERVER/gim,
                /(\ |\t|\(|\,)+AMB_CLIENT/gim,
                /(\ |\t|\(|\,)+AMB_ECM+(\ |\t)/gim,
                /(\ |\t|\(|\,)+PORTRAIT+(\ |\t)/gim,
                /(\ |\t|\(|\,)+LANDSCAPE+(\ |\t)/gim,
                /(\ |\t|\(|\,)+NO_REMOTE/gim,
                /(\ |\t|\(|\,)+REMOTE_DELPHI/gim,
                /(\ |\t|\(|\,)+REMOTE_QTWIN/gim,
                /(\ |\t|\(|\,)+REMOTE_QTLINUX/gim,
                /(\ |\t|\(|\,)+TYPE_CELL/gim,
                /(\ |\t|\(|\,)+TYPE_FORMULA/gim,
                /(\ |\t|\(|\,)+TYPE_FUNCTION/gim,
                /(\ |\t|\(|\,)+TYPE_USER/gim,
                /(\ |\t|\(|\,)+COLLECTION_VALUE/gim,
                /(\ |\t|\(|\,)+COLLECTION_REPORT/gim,
                /(\ |\t|\(|\,)+COLLECTION_SECTION/gim,
                /(\ |\t|\(|\,)+COLLECTION_PAGE/gim,
                /(\ |\t|\(|\,)+TSEEK/gim,
                /(\ |\t|\(|\,)+TCACHE/gim,
                /(\ |\t|\(|\,)+TSTRUCT/gim,
                /(\ |\t|\(|\,)+TALIAS/gim,
                /(\ |\t|\(|\,)+TDESC/gim,
                /(\ |\t|\(|\,)+FSTRUCTALL/gim,
                /(\ |\t|\(|\,)+FSTRUCTFIELD/gim,
                /(\ |\t|\(|\,)+FTITLE/gim,
                /(\ |\t|\(|\,)+FTOOLTIP/gim,
                /(\ |\t|\(|\,)+FFIELD/gim,
                /(\ |\t|\(|\,)+FTYPE/gim,
                /(\ |\t|\(|\,)+FSIZE/gim,
                /(\ |\t|\(|\,)+FDECIMAL/gim,
                /(\ |\t|\(|\,)+FCOMBOBOX/gim,
                /(\ |\t|\(|\,)+FOBRIGAT/gim,
                /(\ |\t|\(|\,)+FUSED/gim,
                /(\ |\t|\(|\,)+FCONTEXT/gim,
                /(\ |\t|\(|\,)+FNIVEL/gim,
                /(\ |\t|\(|\,)+FTABLE/gim,
                /(\ |\t|\(|\,)+FPICTURE/gim,
                /(\ |\t|\(|\,)+FCONPAD/gim,
                /(\ |\t|\(|\,)+ISTRUCTALL/gim,
                /(\ |\t|\(|\,)+ISTRUCTINDEX/gim,
                /(\ |\t|\(|\,)+IDESC/gim,
                /(\ |\t|\(|\,)+IKEY/gim,
                /(\ |\t|\(|\,)+IDESC/gim,
                /(\ |\t|\(|\,)+ITABLE/gim,
                /(\ |\t|\(|\,)+PGROUP/gim,
                /(\ |\t|\(|\,)+PORDER/gim,
                /(\ |\t|\(|\,)+PGSC/gim,
                /(\ |\t|\(|\,)+PTYPE/gim,
                /(\ |\t|\(|\,)+PDESC/gim,
                /(\ |\t|\(|\,)+PPERG1/gim,
                /(\ |\t|\(|\,)+PPERG2/gim,
                /(\ |\t|\(|\,)+PPERG3/gim,
                /(\ |\t|\(|\,)+PPERG4/gim,
                /(\ |\t|\(|\,)+PPERG5/gim,
                /(\ |\t|\(|\,)+PPYME/gim,
                /(\ |\t|\(|\,)+PPICTURE/gim,
            ],
            include: 'RPTDEF.CH',
            precisa: false,
            includes: [],
        });
        //FWPRINTSETUP.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+PD_ISTOTVSPRINTER/gim,
                /(\ |\t|\(|\,)+PD_DISABLEDESTINATION/gim,
                /(\ |\t|\(|\,)+PD_DISABLEORIENTATION/gim,
                /(\ |\t|\(|\,)+PD_DISABLEPAPERSIZE/gim,
                /(\ |\t|\(|\,)+PD_DISABLEPREVIEW/gim,
                /(\ |\t|\(|\,)+PD_DISABLEMARGIN/gim,
                /(\ |\t|\(|\,)+PD_TYPE_FILE/gim,
                /(\ |\t|\(|\,)+PD_TYPE_SPOOL/gim,
                /(\ |\t|\(|\,)+PD_TYPE_EMAIL/gim,
                /(\ |\t|\(|\,)+PD_TYPE_EXCEL/gim,
                /(\ |\t|\(|\,)+PD_TYPE_HTML/gim,
                /(\ |\t|\(|\,)+PD_TYPE_PDF/gim,
                /(\ |\t|\(|\,)+PD_DESTINATION/gim,
                /(\ |\t|\(|\,)+PD_PRINTTYPE/gim,
                /(\ |\t|\(|\,)+PD_ORIENTATION/gim,
                /(\ |\t|\(|\,)+PD_PAPERSIZE/gim,
                /(\ |\t|\(|\,)+PD_PREVIEW/gim,
                /(\ |\t|\(|\,)+PD_VALUETYPE/gim,
                /(\ |\t|\(|\,)+PD_MARGIN/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_LEFT/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_TOP/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_RIGHT/gim,
                /(\ |\t|\(|\,)+PD_MARGIN_BOTTOM/gim,
                /(\ |\t|\(|\,)+PD_OK/gim,
                /(\ |\t|\(|\,)+PD_CANCEL/gim,
            ],
            include: 'FWPRINTSETUP.CH',
            precisa: false,
            includes: [],
        });
        //MSOLE.CH
        this.includeExpressoes.push({
            expressoes: [
                /(\ |\t|\(|\,)+OLEONERROR/gim,
                /(\ |\t|\(|\,)+OLEWDLEFT/gim,
                /(\ |\t|\(|\,)+OLEWDTOP/gim,
                /(\ |\t|\(|\,)+OLEWDWIDTH/gim,
                /(\ |\t|\(|\,)+OLEWDHEIGHT/gim,
                /(\ |\t|\(|\,)+OLEWDCAPTION/gim,
                /(\ |\t|\(|\,)+OLEWDVISIBLE/gim,
                /(\ |\t|\(|\,)+OLEWDWINDOWSTATE/gim,
                /(\ |\t|\(|\,)+OLEWDPRINTBACK/gim,
                /(\ |\t|\(|\,)+OLEWDVERSION/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATDOCUMENT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATTEMPLATE/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATTEXT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATTEXTLINEBREAKS/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATDOSTEXT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATDOSTEXTLINEBREAKS/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATRTF/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATUNICODETEXT/gim,
                /(\ |\t|\(|\,)+WDFORMATHTML/gim,
                /(\ |\t|\(|\,)+WDFORMATDOCUMENTDEFAULT/gim,
                /(\ |\t|\(|\,)+OLEWDFORMATHTML/gim,
            ],
            include: 'MSOLE.CH',
            precisa: false,
            includes: [],
        });
        //RWMAKE.CH
        this.includeExpressoes.push({
            expressoes: [
                /@+(\ |\t)+.+\,+.+(\ |\t)+TO(\ |\t)+.+\,+.+(\ |\t)+DIALOG/gim,
                /@+(\ |\t)+.+\,+.+(\ |\t)+BMPBUTTON/gim,
            ],
            include: 'RWMAKE.CH',
            precisa: false,
            includes: ['STDWIN.CH'],
        });
    }
    valida(objetoValidacao, conteudoFile) {
        //Monta array com includes no fonte
        let includesFonte = objetoValidacao.includes.map((x) => x.include);
        let includesAnalise = this.includeExpressoes.map((x) => x.include);
        if (!objetoValidacao.includes.indexOf((x) => x.include === 'TOTVS.CH')) {
            objetoValidacao.aErros.push(new Erro_1.Erro(0, 0, traduz('includes.faltaTOTVS', this.local), Erro_1.Severity.Warning));
        }
        //Busca includes duplicados
        for (let i = 0, il = objetoValidacao.includes.length; i < il; i++) {
            let include = objetoValidacao.includes[i];
            //Verifica se o include é obsoleto
            if (this.includesObsoletos.indexOf(include.include) !== -1) {
                objetoValidacao.aErros.push(new Erro_1.Erro(include.linha, include.linha, traduz('includes.oInclude', this.local) +
                    include.include +
                    traduz('includes.SubstTOTVS', this.local), Erro_1.Severity.Warning));
            }
            //Verifica se há o mesmo include em uma linha diferente do mesmo fonte
            if (objetoValidacao.includes.findIndex(function (x) {
                return x.include === include.include && x.linha !== include.linha;
            }) !== -1) {
                objetoValidacao.aErros.push(new Erro_1.Erro(include.linha, include.linha, traduz('includes.oInclude', this.local) +
                    include.include +
                    traduz('includes.emDuplicidade', this.local), Erro_1.Severity.Warning));
            }
        }
        //valida necessidade de includes
        let linhas = conteudoFile.split('\n');
        let listaAnalise = [];
        // verifica se alguma expressão foi utilizada no fonte todo
        for (let i = 0, il = this.includeExpressoes.length; i < il; i++) {
            let element = this.includeExpressoes[i];
            for (let i2 = 0, il2 = element.expressoes.length; i2 < il2; i2++) {
                let expressao = element.expressoes[i2];
                if (conteudoFile.match(expressao)) {
                    listaAnalise.push(element);
                    break;
                }
            }
        }
        // monta lista de includes com os contidos
        let includesFonteAll = includesFonte;
        for (let i2 = 0, il2 = objetoValidacao.includes.length; i2 < il2; i2++) {
            let element = this.includeExpressoes[includesAnalise.indexOf(objetoValidacao.includes[i2].include)];
            if (element) {
                includesFonteAll = includesFonteAll.concat(element.includes);
            }
        }
        //Se houver algo para analisar entra no fonte
        if (listaAnalise.length > 0) {
            for (var key in linhas) {
                //seta linha atual
                let linha = ' ' + linhas[key];
                let linhacls = linhas[key];
                for (let i = 0, il = listaAnalise.length; i < il; i++) {
                    let element = listaAnalise[i];
                    for (let i2 = 0, il2 = element.expressoes.length; i2 < il2; i2++) {
                        let expressao = element.expressoes[i2];
                        if (linha.search(expressao) !== -1 ||
                            linhacls.search(expressao) !== -1) {
                            element.precisa = true;
                            //se não estiver na lista de includes
                            if (includesFonteAll.indexOf(element.include) === -1) {
                                objetoValidacao.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('includes.faltaInclude', this.local) +
                                    element.include +
                                    '!', Erro_1.Severity.Error));
                            }
                        }
                    }
                }
            }
        }
        //Verifica se o include é desnecessário
        for (let i2 = 0, il2 = objetoValidacao.includes.length; i2 < il2; i2++) {
            let include = objetoValidacao.includes[i2];
            //se o include é analisado
            let includeAnalise = this.includeExpressoes[includesAnalise.indexOf(include.include)];
            if (includeAnalise) {
                //Verifica se há algum include que está contido nesse INCLUDE
                for (let i = 0, il = includeAnalise.includes.length; i < il; i++) {
                    let includeContido = includeAnalise.includes[i];
                    let includeAnaliseContido = objetoValidacao.includes[includesFonte.indexOf(includeContido)];
                    if (includeAnaliseContido) {
                        includeAnaliseContido.precisa = false;
                        objetoValidacao.aErros.push(new Erro_1.Erro(includeAnaliseContido.linha, includeAnaliseContido.linha, traduz('includes.oInclude', this.local) +
                            includeAnaliseContido.include +
                            traduz('includes.desnecessarioContido', this.local) +
                            include.include +
                            '!', Erro_1.Severity.Warning));
                    }
                }
                if (!includeAnalise.precisa) {
                    objetoValidacao.aErros.push(new Erro_1.Erro(include.linha, include.linha, 'Include ' +
                        include.include +
                        traduz('includes.desnecessario', this.local), Erro_1.Severity.Warning));
                }
            }
        }
    }
}
exports.Include = Include;
function traduz(key, local) {
    let locales = ['en', 'pt-br'];
    let i18n = require('i18n');
    i18n.configure({
        locales: locales,
        directory: __dirname + '/locales',
    });
    i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
    return i18n.__(key);
}
//# sourceMappingURL=include.js.map