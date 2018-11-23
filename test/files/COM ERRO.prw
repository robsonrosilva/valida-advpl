#INCLUDE "rwmake.ch" 
#INCLUDE "PROTHEUS.CH"
#INCLUDE "TBICONN.CH"
#INCLUDE "COLORS.CH"
/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÉÍÍÍÍÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍÍÍÍ»±±
±±ºPrograma  ³NOVO5     º Autor ³ AP6 IDE            º Data ³  14/06/11   º±±
±±ÌÍÍÍÍÍÍÍÍÍÍØÍÍÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍ¹±±
±±ºDescricao ³ Codigo gerado pelo AP6 IDE.                                º±±
±±º          ³                                                            º±±
±±ÌÍÍÍÍÍÍÍÍÍÍØÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹±±
±±ºUso       ³ AP6 IDE                                                    º±±
±±ÈÍÍÍÍÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/

User Function CONFNFE
Local cTitulo 	:= "ESPELHO DA NOTA FISCAL DE ENTRADA"
Local cNumero 	:= "      "
Local oDlg, oButton

Private oNumero, oFornecedor, oSerie
Private cNumero := Replicate(" ", 9)
Private cFornecedor := Replicate(" ", 6)
Private cSerie := "UNI"
Private aArea := getArea()

DEFINE MSDIALOG oDlg FROM 0,0 TO 150,245 PIXEL TITLE "Impressao do Espelho da NFE"

@ 08,10 SAY "Fornecedor :" 	SIZE 30,08 OF oDlg PIXEL 
@ 23,10 SAY "Numero :" 		SIZE 30,08 OF oDlg PIXEL 
@ 38,10 SAY "Serie :" 		SIZE 15,08 OF oDlg PIXEL 

@ 05,55 MSGET oFornecedor 	VAR cFornecedor SIZE 030,08 OF oDlg PIXEL PICTURE "999999" VALID ChkFornecedor(cFornecedor) F3 "SA2"
@ 20,55 MSGET oNumero 		VAR cNumero 	SIZE 030,08 OF oDlg PIXEL PICTURE "999999" 
@ 35,55 MSGET oSerie 		VAR cSerie 		SIZE 015,08 OF oDlg PIXEL 

oButton:=tButton():New(65,35,"Imprimir",oDlg,{||Imprime(cFornecedor, cNumero, cSerie),{oDlg:End()}},50,10,,,,.T.)

ACTIVATE MSDIALOG oDlg CENTERED 

RestArea(aArea)

Return
               
Static Function Imprime(cFornecedor, cNumero, cSerie)
//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Declaracao de Variaveis                                             ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

Local cDesc1       := "Este programa tem como objetivo imprimir relatorio "
Local cDesc2       := "de acordo com os parametros informados pelo usuario."
Local cDesc3       := "Conferencia de Notas Fiscais de Entrada"
Local cPict        := ""
Local titulo       := "Conferencia de Notas Fiscais de Entrada"
Local nLin         := 6
Local Cabec1       := ""
Local Cabec2       := ""
Local imprime      := .T.
Local aOrd := {}

Private lEnd        := .F.
Private lAbortPrint  := .F.
Private CbTxt       := ""
Private limite     := 	80
Private tamanho    := 	"G"
Private nomeprog   := "CONFNFE" // Coloque aqui o nome do programa para impressao no cabecalho
Private nTipo      := 18
Private aReturn    := { "Zebrado", 1, "Administracao", 2, 2, 1, "", 1}
Private nLastKey   := 0
Private cbtxt      := Space(10)
Private cbcont     := 00
Private CONTFL     := 01
Private m_pag      := 01
Private wnrel      := "NOME" // Coloque aqui o nome do arquivo usado para impressao em disco

dbSelectArea("SF1")
dbSetOrder(1)                                               
if !dbSeek(xFilial("SF1") + cNumero + cSerie + cFornecedor)
   MsgBox("Nota Fiscal não encontrada!")
   RestArea(aArea)
   Return
Endif
                                          
                                          
                                          
//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Monta a interface padrao com o usuario...                           ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

wnrel := SetPrint("SF1",NomeProg,"",@titulo,cDesc1,cDesc2,cDesc3,.T.,aOrd,.T.,Tamanho,,.T.)

If nLastKey == 27
	Return
Endif
                       
SetDefault(aReturn,"SF1")

If nLastKey == 27
	Return
Endif

nTipo := If(aReturn[4]==1,15,18)

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Processamento. RPTSTATUS monta janela com a regua de processamento. ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

RptStatus({|| RunReport(Cabec1,Cabec2,Titulo,nLin) },Titulo)

Return

Static Function ChkFornecedor(fornecedor)
Local toReturn := .T.
dbSelectArea("SA2")
dbSetOrder(1)
if !dbSeek(xFilial("SA2")+fornecedor)
   MsgBox("Fornecedor não encontrado!")
   toReturn := .F.
EndIf
Return toReturn 

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÉÍÍÍÍÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍÍÍÍ»±±
±±ºFun‡„o    ³RUNREPORT º Autor ³ AP6 IDE            º Data ³  14/06/11   º±±
±±ÌÍÍÍÍÍÍÍÍÍÍØÍÍÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍ¹±±
±±ºDescri‡„o ³ Funcao auxiliar chamada pela RPTSTATUS. A funcao RPTSTATUS º±±
±±º          ³ monta a janela com a regua de processamento.               º±±
±±ÌÍÍÍÍÍÍÍÍÍÍØÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹±±
±±ºUso       ³ Programa principal                                         º±±
±±ÈÍÍÍÍÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/

Static Function RunReport(Cabec1,Cabec2,Titulo,nLin)

Local nOrdem

dbSelectArea("SF1")

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ SETREGUA -> Indica quantos registros serao processados para a regua ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

SetRegua(RecCount())

dbSelectArea("SA2")
dbSetOrder(1)
if !dbSeek(xFilial()+cFornecedor)
	MsgBox("Fornecedor não encontrado!")
    Return
EndIf

SetRegua(RecCount())
                   
Cabec(Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)

nLin := 6                         

@ ++ nLin, 000 PSAY "DADOS DA NOTA FISCAL:"
@ ++ nLin, 000 PSAY Replicate("-",165)
@ ++ nLin, 000 PSAY "Numero / Serie     : " + RTRIM(SF1->F1_DOC) + " / " + SF1->F1_SERIE
@    nLin, 040 PSAY "Emissao : " + DTOC(SF1->F1_EMISSAO)
@    nLin, 065 PSAY "Tipo : " + SF1->F1_TIPO
@    nLin, 075 PSAY "Proprio : " + SF1->F1_FORMUL
@    nLin, 090 PSAY "Especie : " + SF1->F1_ESPECIE
++nLin

@ ++ nLin, 000 PSAY "DADOS DO FORNECEDOR:"
@ ++ nLin, 000 PSAY Replicate("-",165)
@ ++ nLin, 000 PSAY "Codigo Fornecedor  : " + SA2->A2_COD
@    nLin, 028 PSAY "Tipo : " + SA2->A2_TIPO
If SA2->A2_TIPO == "F"
	@ nLin, 038 PSAY "C.N.P.J. : "  + Transform( SA2->A2_CGC , "@R 999.999.999-99" )
Else
	@ nLin, 038 PSAY "C.N.P.J. : "  + Transform( SA2->A2_CGC , "@R 99.999.999/9999-99" )
Endif
@    nLin, 073 PSAY "I.E. : "  + SA2->A2_INSCR
@ ++ nLin, 000 PSAY "Nome do Fornecedor : " + SA2->A2_NOME
@ ++ nLin, 000 PSAY "Endereco           : " + SA2->A2_END 
@ ++ nLin, 000 PSAY "Bairro             : " + SA2->A2_BAIRRO
@    nLin, 043 PSAY "Cidade : "  + SA2->A2_MUN
@    nLin, 073 PSAY "UF : "  + SA2->A2_EST
@    nLin, 084 PSAY "C.E.P. : "  + Transform(SA2->A2_CEP, "@R 99999-999") 
@ ++ nLin, 000 PSAY "Telefone           : " + SA2->A2_TEL
@    nLin, 043 PSAY "FAX    : "  + SA2->A2_FAX
@    nLin, 073 PSAY "Celular : "  + SA2->A2_TELEX
@ ++ nLin, 000 PSAY "E-mail             : " + SA2->A2_EMAIL
@    nLin, 073 PSAY "Contato : "  + SA2->A2_CONTATO
++nLin

dbSelectArea("SE4")
dbSetOrder(1)
dbSeek(xFilial()+SF1->F1_COND)
@ ++ nLin, 000 PSAY "CONDICAO DE PAGAMENTO : " + SF1->F1_COND + " - " + SE4->E4_DESCRI
@ ++ nLin, 000 PSAY Replicate("-",165)

cQuery := "SELECT * FROM SE2010 "
cQuery += "WHERE E2_NUM = '" + SF1->F1_DOC + "' "
cQuery += "AND   E2_PREFIXO = '" + SF1->F1_SERIE + "' "
cQuery += "AND   E2_FORNECE  = '" + SF1->F1_FORNECE + "' "
cQuery += "AND   E2_TIPO  = '" + SF1->F1_ESPECIE + "' "
cQuery += "AND D_E_L_E_T_ <> '*'"

cQuery := ChangeQuery(cQuery)
dbUseArea(.T.,"TOPCONN",TcGenQry(,,cQuery),"SQL",.T.,.T.)
                               
nValSE2 := 0
If !SQL->(EOF())
	@ ++ nLin,000 psay "PRF"
	@    nLin,005 psay "NUMERO"
	@    nLin,012 psay "PC"
	@    nLin,015 psay "FORNECEDOR"
	@    nLin,067 psay "VENCTO"
	@    nLin,085 psay "VALOR"
	@    nLin,095 psay "OBS"
	@    nLin,157 psay "NATUREZA"
	@ ++ nLin,000 Psay Replicate("-",165)
	nLin ++ 

	While !Eof()
		@ nLin, 000 psay SQL->E2_PREFIXO
		@ nLin, 005 psay SQL->E2_NUM
		@ nLin, 012 psay SQL->E2_PARCELA
		@ nLin, 015 psay SA2->A2_NOME
		@ nLin, 066 psay STOD(SQL->E2_VENCTO)
		@ nLin, 080 psay SQL->E2_VALOR Picture "@E 999,999.99"
		@ nLin, 095 psay SQL->E2_HIST Picture "@!"
		@ nLin, 157 psay SQL->E2_NATUREZ
		nValSE2 += SQL->E2_VALOR
		IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
		dbSkip()
		Loop
	EndDo

	If nValSE2 > 0
		@ nLin,00 psay Replicate("-",165)
		IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)        
		@ nLin,00 psay "Total:"
		@ nLin,80 psay nValSE2 Picture "@E 999,999.99"
		IncLinha(@nLin, 2, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)        
	Endif
Else
	@ ++ nLin,00 psay "(NAO EXISTEM TITULOS A RECEBER PARA ESTA NOTA FISCAL)"	    
	IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)   
Endif
dbCloseArea("SQL")

@ nLin, 000 PSAY "ITENS DA NOTA FISCAL: "
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
@ nLin, 000 PSAY Replicate("-",165)
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
@ nLin,003 PSAY "CODIGO"
@ nLin,014 PSAY "DESCRICAO"
@ nLin,055 PSAY "QUANTIDADE"
@ nLin,066 PSAY "V.UNITARIO"
@ nLin,077 PSAY "VLR. TOTAL"
@ nLin,088 PSAY "VLR. IPI"
@ nLin,097 PSAY "ICMS" 
@ nLin,103 PSAY "VLR.ICMS" 
@ nLin,112 PSAY "TES" 
@ nLin,116 PSAY "TEXTO"      
@ nLin,137 PSAY "CFOP"
@ nLin,143 PSAY "NCM/SH"  
@ nLin,151 PSAY "CST"
@ nLin,156 PSAY "PEDIDO"
@ nLin,163 PSAY "AR"

IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
@ nLin, 000 PSAY Replicate("-",165)
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
                                                   
cQuery := "SELECT * FROM SD1010 "
cQuery += "WHERE D1_DOC = '" + SF1->F1_DOC + "' "
cQuery += "AND   D1_SERIE = '" + SF1->F1_SERIE + "' "
cQuery += "AND   D1_FORNECE  = '" + SF1->F1_FORNECE + "' "
cQuery += "AND D_E_L_E_T_ <> '*'"

cQuery := ChangeQuery(cQuery)
dbUseArea(.T.,"TOPCONN",TcGenQry(,,cQuery),"SQL",.T.,.T.)
                               
nValProd := 0
If !SQL->(EOF())
	While !SQL->(EOF())
		dbSelectArea("SB1")
		dbsetOrder(1)
		dbSeek(xFilial()+SQL->D1_COD)
		
		dbSelectArea("SF4")
		dbSetOrder(1)
		dbSeek(xFilial()+SQL->D1_TES)
	
		@ nLin,000 psay SB1->B1_COD
		@ nLin,014 psay SubStr(SB1->B1_DESC,1,39)
		@ nLin,055 psay SQL->D1_QUANT 	Picture "@E 999,999.99"
		@ nLin,066 psay SQL->D1_VUNIT 	Picture "@E 999,999.99"
		@ nLin,077 psay SQL->D1_TOTAL 	Picture "@E 999,999.99"
		@ nLin,088 psay SQL->D1_IPI		Picture "@E 9,999.99"
		@ nLin,097 psay SQL->D1_PICM 	Picture "@E 99.99"
		@ nLin,103 psay SQL->D1_VALICM	Picture "@E 9,999.99"
		@ nLin,112 psay SQL->D1_TES
		@ nLin,116 psay SF4->F4_TEXTO
		@ nLin,137 psay SQL->D1_CF
		@ nLin,143 psay SB1->B1_POSIPI
		@ nLin,151 psay SQL->D1_CLASFIS
		@ nLin,156 psay SQL->D1_PEDIDO
		@ nLin,163 psay SQL->D1_LOCAL

/*
  3          14                                       55         66         77         88       97    103      112 116                  137   143     151  156    163  
  CODIGO     DESCRICAO                                QUANTIDADE V.UNITARIO VLR. TOTAL VLR. IPI ICMS  VLR.ICMS TES TEXTO                CFOP  NCM/SH  CST  PEDIDO AR 
0            14                                       55         66         77         88       97    103      112 116                  137  142      151  156    163     
0000000000   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX 999,999.99 999,999.99 999,999.99 9,999.99 99.99 9,999.99 000 XXXXXXXXXXXXXXXXXXXX 5102 99999999 000  000000 00
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

*/
		nValProd := nValProd + (SQL->D1_TOTAL + SQL->D1_IPI)
	
		IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
	
		dbSelectArea("SQL")
		dbSkip()
		Loop
	EndDo
	@ nLin, 000 Psay Replicate("-",165)
/*	IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
	@ nLin, 000 Psay "Total:"
	@ nLin, 066 psay nValProd	Picture "@E 999,999.99"              
	If (nValSE2<>nValProd) .AND. (nValSE2>0)
	   @ nLin,167 psay 'ERRO->VALOR DOS PRODUTOS DIFERENTE DO VALOR DOS TITULOS'
	Endif
*/
Else
	@ ++ nLin,00 psay "(NAO EXISTEM ITENS PARA ESTA NOTA FISCAL)"	    
Endif
dbCloseArea("SQL")

IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)   
@ nLin,000 psay "| Base de Calculo ICMS           | Valor do ICMS                  | Base de Calc. Substituicao     | Valor do ICMS Substituicao    | Valor das Mercadorias          |"
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)   
@ nLin,000 Psay "|                                |                                |                                |                               |                                |"
@ nLin,012 psay SF1->F1_BASEICM		Picture "@E 9,999,999,999,999.99"
@ nLin,045 psay SF1->F1_VALICM		Picture "@E 9,999,999,999,999.99"
@ nLin,078 psay SF1->F1_BRICMS		Picture "@E 9,999,999,999,999.99"
@ nLin,110 psay SF1->F1_ICMSRET		Picture "@E 9,999,999,999,999.99"
@ nLin,143 psay SF1->F1_VALMERC		Picture "@E 9,999,999,999,999.99"
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)   
@ nLin, 000 Psay Replicate("-",165)
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)   
@ nLin,000 psay "| Valor do Frete          | Valor do Seguro         | Desconto                | Outras Despesas        | Valor do IPI              | Valor Total da Nota            |"
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)   
@ nLin,000 psay "|                         |                         |                         |                        |                           |                                |"
@ nLin,011 psay SF1->F1_FRETE		Picture "@E 999,999,999.99"
@ nLin,037 psay SF1->F1_SEGURO		Picture "@E 999,999,999.99"
@ nLin,063 psay SF1->F1_BRICMS		Picture "@E 999,999,999.99"
@ nLin,088 psay SF1->F1_DESPESA		Picture "@E 999,999,999.99"
@ nLin,116 psay SF1->F1_VALIPI		Picture "@E 999,999,999.99"
@ nLin,143 psay SF1->F1_VALBRUT		Picture "@E 9,999,999,999,999.99"
IncLinha(@nLin, 1, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)   
@ nLin, 000 Psay Replicate("-",165)
/*
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Base de Calculo ICMS           | Valor do ICMS                  | Base de Calc. Substituicao     | Valor do ICMS Substituicao    | Valor das Mercadorias          |
|           9,999,999,999,999.99 |           9,999,999,999,999.99 |           9,999,999,999,999.99 |          9,999,999,999,999.99 |           9,999,999,999,999.99 | 
|                                |                                |                                |                               |                                |
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
| Valor do Frete          | Valor do Seguro         | Desconto                | Outras Despesas        | Valor do IPI              | Valor Total da Nota            |
|          999,999,999.99 |          999,999,999.99 |          999,999,999.99 |         999,999,999.99 |            999,999,999.99 |           9,999,999,999,999.99 | 
|                         |                         |                         |                        |                           |                                |
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
CODIGO     DESCRICAO                       QUANTIDADE V.UNITARIO VLR. TOTAL VLR. IPI  ICMS VLR.ICMS TES TEXTO      CFOP C.FISCAL  NCM/SH  CST PEDIDO
9999999999 XOXOXOXOXOXOXOXOXOXOXOXOXOXOXOX 999,999.99 999,999.99 999,999.99 9,999.99 99,99 9,999.99 999 XOXOXOXOXO 9999 XOXOXOXO 99999999 000 999999
*/                                        



//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Finaliza a execucao do relatorio...                                 ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

SET DEVICE TO SCREEN

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Se impressao em disco, chama o gerenciador de impressao...          ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

If aReturn[5]==1
   dbCommitAll()
   SET PRINTER TO
   OurSpool(wnrel)
Endif
                                                

MS_FLUSH()

Return

Static Function IncLinha(nLin, Salto, Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)

   nLin := nLin + Salto
   //ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
   //³ Impressao do cabecalho do relatorio. . .                            ³
   //ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
   If nLin > 68 // Salto de Página. Neste caso o formulario tem 60 linhas...
      Cabec(Titulo,Cabec1,Cabec2,NomeProg,Tamanho,nTipo)
      nLin := 7
   Endif                                                                                                              

Return 
