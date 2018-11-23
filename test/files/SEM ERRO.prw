#Include "MsOle.ch"
#Include "Report.ch"
#Include "RwMake.ch"
#Include "TopConn.ch"
#Include "Protheus.ch"

/*
------------------------------------------------------------------------------------------------------------
Função: MMCOMR01
Tipo: Relatório de Pedido de Compras
Descrição: Relatório de Pedido de Compras - Termo da contratação
Uso: Micromed - Compras
Parâmetros:
Retorno:
------------------------------------------------------------------------------------------------------------
Atualizações:
- 05/04/2013 - Luciano Camargo - Construção inicial do fonte
- 13/07/2015 - Bruno Coelho - Ajustes de texto, solicitados pelo usuário
------------------------------------------------------------------------------------------------------------
*/

User Function MMCOMR01

	Local cPerg	:= "MMCOMR01"
	Local oGroup1
	Local oSButton1
	Local oSButton2
	Local oSButton3
	Local oSay1
	Local oSay2
	Local oSay3
	Local oSay4
	Local fone :=""
	Local fax  :=""
	Local cel  :=""
	Local email:=""

	Private	NPOS1
	Private _nPosSaldo	:= 0
	Private	oPrint
	Private nPos		:= 0	// LINHA DE IMPRESSAO DO RELATORIO GRAFICO
	Private CONTFL		:= 1	// CONTA PAGINA
	Private oGeraRel
	Private _aDados		:= {}	// Array que irá armazenar os dados a serem apresentados no relatório
	Private	_nItePag	:= 36	// Quantidade de Itens por Página
	Private _nLin       := 100
	Private _eMailCOM   := GetMv("MM_EMAIL01") // eMail do Departamento de Compras
	Private _eMailCP    := GetMv("MM_EMAIL02") // eMail do Departamento de Contas a Pagar
	Private _eMailNFE   := GetMv("MM_EMAIL03") // eMail do Departamento de Contas a Receber
	Private _cNmEmpr    := "MICROMED"
	Private _ColFim     := 2400

	//Cria grupo de perguntas
	GeraSX1(cPerg)

	//Alimenta as Variaveis das Perguntas
	Pergunte(cPerg,.F.)
	//MV_PAR01 := SC7->C7_NUM

	// Monta tela de interface com o usuario
	DEFINE MSDIALOG oGeraRel TITLE "Relatório de Pedido de Compras" FROM 000, 000  TO 150, 400 COLORS 0, 16777215 PIXEL
	@ 000, 002 GROUP oGroup1 TO 073, 198 PROMPT "Relatório de Pedido de Compras" OF oGeraRel COLOR 0, 16777215 PIXEL
	DEFINE SBUTTON oSButton1 FROM 059, 135 TYPE 01 OF oGeraRel ENABLE ACTION GeraRel()
	DEFINE SBUTTON oSButton2 FROM 059, 102 TYPE 05 OF oGeraRel ENABLE ACTION Pergunte(cPerg,.T.)
	DEFINE SBUTTON oSButton3 FROM 059, 165 TYPE 02 OF oGeraRel ENABLE ACTION Close(oGeraRel)
	@ 012, 010 SAY oSay1 PROMPT "Esse relatório tem por objetivo imprimir um Pedido de Compras." SIZE 179, 010 OF oGeraRel COLORS 0, 16777215 PIXEL
	@ 022, 010 SAY oSay2 PROMPT "Para informar a pedido desejado, basta clicar no botão de " SIZE 176, 010 OF oGeraRel COLORS 0, 16777215 PIXEL
	@ 032, 010 SAY oSay3 PROMPT "Parâmetros. Assim que concluir, basta clicar em OK." SIZE 179, 010 OF oGeraRel COLORS 0, 16777215 PIXEL

	ACTIVATE MSDIALOG oGeraRel CENTERED

Return

/*______________________________________________________________________________
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¦¦+--------------------------------------------------------------------------+¦¦
¦¦¦Função     ¦ GeraSX1    ¦ Autor ¦ Daniel F.Oliveira   ¦ Data ¦ 26/04/2010 ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦Descrição  ¦ Cria Grupo de Perguntas para esse relatório                  ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*/
Static Function GeraSX1(cGrpPerg)
	Local aHelpPor := {} //help da pergunta
	_sAlias := Alias()
	dbSelectArea("SX1")
	SX1->(dbSetOrder(1))
	cPerg   := PADR(cGrpPerg,Len(SX1->X1_GRUPO))
	aRegs   := {}

	//Grupo/Ordem/Perg.Port/Perg.Esp/Perg.Ingles/Variavel/Tipo/Tamanho/Decimal/Presel/GSC/Valid/Var01/DEF01/DEF.ESP01/DEF.ENG01/CNT01/VAR02/DEF02/DEF.ESP02/DEF.ENG02/CNT02/VAR03/DEF03/DEF.ESP03/DEF.ENG03/CNT03/VAR04/DEF04/DEF.ESP04/DEF.ENG04/CNT04/VAR05/DEF05/DEF.ESP05/DEF.ENG05/CNT05/F3/PYME/GRPSXG/HELP
	aadd(aRegs,{cPerg,"01","Pedido Nr","","","mv_ch1","C", TamSX3("C7_NUM")[1]    ,0,0,"G","naovazio","mv_par01","","","","","","","","","","","","","","","","","","","","","","","","","SC7","","",""})
	aAdd(aRegs,{cPerg,"02","Impr.Dados Emissao Nota","","","mv_ch2","N",01,0,1,"C","","MV_PAR02","Sim","","","","","Nao","","","","","","","","","","","","","","","","","","","",""})

	For i:=1 to Len(aRegs)
		If !SX1->(dbSeek(cPerg+aRegs[i,2],.f.))
			RecLock("SX1",.T.)
			For j:=1 to len(aRegs[i])
				SX1->(FieldPut(j,aRegs[i,j]))
			Next
			SX1->(MsUnlock())
		Else
			If SX1->X1_TAMANHO != aRegs[i][8] .OR. SX1->X1_DECIMAL != aRegs[i][9]
				RecLock("SX1",.F.)
				For j:=1 to len(aRegs[i])
					SX1->(FieldPut(j,aRegs[i,j]))
				Next
				SX1->(MsUnlock())
			Endif
		Endif
	Next
Return

/*______________________________________________________________________________
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¦¦+--------------------------------------------------------------------------+¦¦
¦¦¦Função     ¦ GeraRel    ¦ Autor ¦Luciano Camargo      ¦ Data ¦ 13/03/2012 ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦Descrição  ¦ Chama a Processa do Relatorio                                ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*/
Static Function GeraRel()
	// Criação do Objeto para Impressao Grafica
	oPrint 	:= TMSPrinter():New("Relatório de pedido de compras")
	//oPrint:SetPortrait() // DEFINE IMPRESSAO RETRATO
	oPrint:SetLandscape() // DEFINE IMPRESSAO PAISAGEM

	// Chama a Função de Geração do Relatório
	Processa({|| RunRelat() },"Gerando Relatório Gráfico...")

	oPrint:Preview()  		// Visualiza impressao grafica antes de imprimir
	Close(oGeraRel)
Return

/*______________________________________________________________________________
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¦¦+--------------------------------------------------------------------------+¦¦
¦¦¦Função     ¦ RunRelat   ¦ Autor ¦ Luciano Camargo     ¦ Data ¦ 13/03/2012 ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦Descrição  ¦ Gera o Relatorio Gráfico                                     ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*/
Static Function RunRelat
	Local	_cQry		:= ""
	Local  TotLin       :=0
	Local  tLin         :=0
	Local  xLinha       :=""
	Local _cLinha, _cLinha1
	private _aDados  	:= {}

	oArial06	:= TFont():New("Arial",06,06,,.F.,,,,.T.,.F.)
	oArial06n	:= TFont():New("Arial",06,06,,.T.,,,,.T.,.F.)
	oCourier07	:= TFont():New("Courier",07,07,,.F.,,,,.T.,.F.)
	oArial07	:= TFont():New("Arial",07,07,,.F.,,,,.T.,.F.)
	oArial07n	:= TFont():New("Arial",07,07,,.T.,,,,.T.,.F.)
	oCourier08	:= TFont():New("Courier",08,08,,.F.,,,,.T.,.F.)
	oArial08	:= TFont():New("Arial",08,08,,.F.,,,,.T.,.F.)
	oArial08n	:= TFont():New("Arial",08,08,,.T.,,,,.T.,.F.)
	oCourier09	:= TFont():New("Courier",09,09,,.F.,,,,.T.,.F.)
	oArial09	:= TFont():New("Arial",09,09,,.F.,,,,.T.,.F.)
	oArial09n	:= TFont():New("Arial",09,09,,.T.,,,,.T.,.F.)
	oArial10	:= TFont():New("Arial",10,10,,.F.,,,,.T.,.F.)
	oArial10n	:= TFont():New("Arial",10,10,,.T.,,,,.T.,.F.)
	oArial11	:= TFont():New("Arial",11,11,,.F.,,,,.T.,.F.)
	oArial11n	:= TFont():New("Arial",11,11,,.T.,,,,.T.,.F.)
	oArial12	:= TFont():New("Arial",12,12,,.F.,,,,.T.,.F.)
	oArial12n	:= TFont():New("Arial",12,12,,.T.,,,,.T.,.F.)
	oArial13	:= TFont():New("Arial",13,13,,.F.,,,,.T.,.F.)
	oArial13n	:= TFont():New("Arial",13,13,,.T.,,,,.T.,.F.)
	oArial14	:= TFont():New("Arial",14,14,,.F.,,,,.T.,.F.)
	oArial14n	:= TFont():New("Arial",14,14,,.T.,,,,.T.,.F.)
	oArial15	:= TFont():New("Arial",15,15,,.F.,,,,.T.,.F.)
	oArial15n	:= TFont():New("Arial",15,15,,.T.,,,,.T.,.F.)
	oArial16	:= TFont():New("Arial",16,16,,.F.,,,,.T.,.F.)
	oArial16n	:= TFont():New("Arial",16,16,,.T.,,,,.T.,.F.)

	//Cria consulta no Banco de Dados obedecendo aos parâmetros da rotina
	_cQry := " SELECT * "
	_cQry += "	FROM " + RETSQLNAME("SC7") + " AS C7 "
	_cQry += "	WHERE  C7.C7_FILIAL = '" + xFilial("SC7") + "' "
	_cQry += "	 AND C7.C7_NUM    = '" + MV_PAR01 + "'"
	_cQry += "	 AND C7.D_E_L_E_T_ = '' "
	_cQry += "	ORDER BY C7_ITEM "



	/*_cQry := "select c7_num, c7_item,"
	_cQry += "       c7_produto,"
	_cQry += "	     c7_descri,"
	_cQry += "	     c7_naturez,"
	_cQry += "	     c7_cc,"
	_cQry += "	     c7_um,"
	_cQry += "	     c7_preco,"
	_cQry += "	     c7_total,"
	_cQry += "	     c7_datprf,"
	_cQry += "		 c7_quant, "
	_cQry += "		 C7_VALFRE, "
	_cQry += "		 C7_DESPESA, "
	_cQry += "		 C7_SEGURO, "
	_cQry += "		 C7_VALIPI, "
	_cQry += "		 C7_VLDESC "
	_cQry += "  from " + RetSqlName("SC7") + " sc7, "
	_cQry += " WHERE  SC7.c7_filial = '" + xFilial("SC7") + "'"
	_cQry += "   and sc7.c7_num    = '" + MV_PAR01 + "'"
	_cQry += "   and sc7.d_e_l_e_t_ = ' '"
	_cQry += " order by c7_item*/
	TCQUERY ChangeQuery(_cQry) New Alias "TMP"
	_nTotGeral 	:= 0
	_nTotMerc	:= 0
	_nValFre	:= 0
	_nValDesc	:= 0
	_nTotIPI 	:= 0
	_nDTent		:= 0
	_nCond		:= 0

	While ! TMP->(Eof())

		//A1_FILIAL, A1_COD, A1_LOJA
		SA2->(DbSetOrder(1))
		SA2->(DbSeek(xFilial("SA1")+ TMP->C7_FORNECE + TMP->C7_LOJA))

		aAdd(_aDados,	{StrZero(Val(TMP->C7_ITEM),4)	 						,;	// [01] - Item PC
		Alltrim(TMP->C7_PRODUTO)					     						,;	// [02] - Produto
		Alltrim(TMP->C7_DESCRI)					 	 						    ,;	// [03] - Descrição produto
		Alltrim(TMP->C7_UM)						         						,;	// [04] - Unidade de medida
		Alltrim(TMP->C7_OBS)		  					 						,;	// [05] - Observacao
		Alltrim(POSICIONE("SB1",1,xFilial("SB1")+TMP->C7_PRODUTO,"B1_REFCOM"))	,;  // [06] - Referência Comercial
		Transform(TMP->C7_PRECO,"@E 999,999.99")         						,;	// [07] - Preco
		Transform(TMP->C7_TOTAL,"@E 999,999.99")         						,;	// [08] - Total
		Transform(TMP->C7_QUANT,"@E 9999.99")            						,;	// [09] - Quantidade
		Transform(TMP->C7_VALIPI,"@E 9999.99")           						,;	// [10] - Valor IPI
		Transform(TMP->(C7_TOTAL + C7_VALIPI),"@E 999,999.99")					,;// [11] - Total + IPI
		AllTrim(TMP->C7_NATUREZ) + " - " + POSICIONE("SED",1,xFilial("SED")+ TMP->C7_NATUREZ,"ED_DESCRIC")})//[12] - Natureza - Descrição


		_nTotMerc 	+= TMP->C7_TOTAL
		_nTotIPI	+= TMP->C7_VALIPI
		_nValFre 	+= TMP->(C7_VALFRE + C7_DESPESA + C7_SEGURO)
		_nValDesc	+= TMP->C7_VLDESC
		_nDTent		:= TMP->C7_DATPRF
		_nCond		:= TMP->C7_COND

		TMP->(DbSkip())

	Enddo

	_nTotGeral	+= (_nTotMerc + _nValFre) - _nValDesc

	TMP->(DbCloseArea())

	if Len(_aDados) == 0
		MsgStop("Não foram encontrados registros que atendem aos parâmetros!!!","A T E N Ç Ã O !!!")
		Return
	endif

	_nCont := 1
	fCabecalho()

	For _x := 1 to Len(_aDados)

		_cLinha := Substr( _aDados[_x][02]+"-"+_aDados[_x][03]+IIF( !Empty(_aDados[_x][05]),": ",""),1,85) // Codigo + descricao

		// Imprime os Dados do Relatório
		VerNewPag()
		oPrint:Say(_nLin   ,0170,_aDados[_x][01],oArial08n)	// Item PC
		oPrint:Say(_nLin   ,0270,_cLinha        ,oArial08n)	// Item PC
		oPrint:Say(_nLin   ,2260,_aDados[_x][11],oArial08n)	// TOTAL + IPI
		oPrint:Say(_nLin   ,1530,_aDados[_x][04],oArial08n)  // Unidade Medida
		oPrint:Say(_nLin   ,1950,_aDados[_x][08],oArial08n)	// TOTAL
		//oPrint:Say(_nLin   ,1350,_aDados[_x][06],oArial08n)	// Referência Comercial
		oPrint:Say(_nLin   ,1790,_aDados[_x][07],oArial08n)	// Valor Unitario
		oPrint:Say(_nLin   ,1660,_aDados[_x][09],oArial08n)	// Quantidade
		oPrint:Say(_nLin   ,2120,_aDados[_x][10],oArial08n)	// IPI

		_cLinha1 := _aDados[_x][05]
		TotLin := MlCount(_cLinha1,80)

		If (! empty(_aDados[_x][6]))
			_nLin += 30
			VerNewPag()
			oPrint:Say(_nLin,0270,Alltrim(_aDados[_x][6]),oArial07)	// Referencia Comercial
		EndIf

		For tLin := 1 To TotLin //  obs [produto]
			xLinha := (MemoLine( _cLinha1,80,tLin))
			If xLinha <> Space(80)
				_nLin += 30
				VerNewPag(); oPrint:Say(_nLin,0270,xLinha,oArial07)	// Produto Codigo + Descricao + obs
			EndIf
		Next

		_nLin += 40
		oPrint:Box(_nLin,0145,_nLin,_ColFim)

		// Posiciona salto para a proxima linha
		_nLin += 20
		_nCont++

	Next _x

	VerNewPag(_nLin+200) ; oPrint:Box(_nLin,0145,_nLin+310,_ColFim)
	VerNewPag() ; oPrint:Box(_nLin,2000,_nLin+310,2000) ; _nLin += 10

	_nLin += 10

	VerNewPag() ; oPrint:Say(_nLin  ,0170,"Valor das mercadorias: " + AllTrim(Transform(_nTotMerc,"@E 9999,999.99")),oArial08n); _nLin += 045
	VerNewPag() ; oPrint:Say(_nLin  ,0170,"Valor do IPI: " + AllTrim(Transform(_nTotIPI,"@E 9999,999.99")),oArial08n); _nLin += 045
	VerNewPag() ; oPrint:Say(_nLin  ,0170,"Valor Total com IPI: " + AllTrim(Transform(_nTotMerc + _nTotIPI,"@E 9999,999.99")),oArial08n)
	VerNewPag() ; oPrint:Say(_nLin  ,0800,"Data de Entrega: " + Transform(STOD(_nDTent),"@D"),oArial08n); _nLin += 045
	VerNewPag() ; oPrint:Say(_nLin  ,0170,"Descontos: " + AllTrim(Transform(_nValDesc,"@E 9999,999.99")),oArial08n)
	VerNewPag() ; oPrint:Say(_nLin	,2010,"Condição Pagamento: ",oArial08) ; _nLin += 45
	VerNewPag() ; oPrint:Say(_nLin  ,0170,"Frete/Despesas: " + AllTrim(Transform(_nValFre,"@E 9999,999.99")),oArial08n)
	VerNewPag() ; oPrint:Say(_nLin	,2010,"("+_nCond+") "+AllTrim(Posicione("SE4",1,xFilial("SE4")+_nCond,"E4_DESCRI")),oArial08n) 	; _nLin += 065


	VerNewPag() ; oPrint:Say(_nLin,0170,"Total do pedido: "+AllTrim(Transform(_nTotGeral  + _nTotIPI,"@E 9999,999.99")),oArial10n)
	VerNewPag() ; oPrint:Say(_nLin,0800,"("+Extenso(_nTotGeral)+")",oArial08n)

	_nLin += 70

	fRodape()
Return
/*______________________________________________________________________________
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¦¦+--------------------------------------------------------------------------+¦¦
¦¦¦Função     ¦ fCabecalho ¦ Autor ¦ Daniel F.Oliveira   ¦ Data ¦ 16/04/2010 ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦Descrição  ¦ Monta o Cabecalho do Relatorio                               ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*/
Static Function fCabecalho()
	Local _cFileLogo

	_cFileLogo	:= '\logos\logo.bmp'

	oPrint:StartPage() //Inicia uma nova pagina

	// Desenha o Box do Cabecalho e Logo
	oPrint:SayBitmap(075,0145,_cFileLogo,0500,0150) //Tamanho da Imagem: 134 x 61

	// EVENTO
	oPrint:Say(_nLin,0700,"TERMO DE CONTRATAÇÃO DE FORNECIMENTO",oArial16n,100) ; _nLin := _nLin + 060
	oPrint:Say(_nLin,0700,"DE PRODUTOS E SERVIÇOS - NR.: "+MV_PAR01,oArial16n,100) ; _nLin := _nLin + 020

	_nLin := _nLin + 090

	// FORNECEDOR
	oPrint:Say(_nLin,0170,"DA IDENTIFICAÇÃO DO FORNECEDOR",oArial10n,100)

	oPrint:Say(_nLin,1900,"Impresso em: "+DtoC(dDataBase),oArial08,100); _nLin += 60  // LPC 15/05/2014

	oPrint:Box(_nLin,0145,_nLin+100,_ColFim) ; _nLin += 10

	oPrint:Say(_nLin,0170,"Razão Social / Nome:",oArial08,100) ; _nLin += 30
	oPrint:Say(_nLin,0170,AllTrim(SA2->A2_NOME)+' ('+AllTrim(SA2->A2_COD)+'-'+IIF(SA2->(A2_NREDUZ<>A2_NOME),AllTrim(SA2->A2_NREDUZ)+")",""),oArial08n,100) ; _nLin += 60

	oPrint:Box(_nLin,0145,_nLin+100,_ColFim) ; _nLin += 10
	oPrint:Say(_nLin,0170,"Endereço:",oArial08,100)
	oPrint:Say(_nLin,1450,"Bairro / Cidade:",oArial08,100)
	oPrint:Say(_nLin,2100,"UF:",oArial08,100)
	oPrint:Say(_nLin,2200,"CEP:",oArial08,100) ; _nLin += 30

	oPrint:Say(_nLin,0170,AllTrim(SA2->A2_END),oArial08n,100)
	oPrint:Say(_nLin,1450,Substr(SA2->(AllTrim(A2_BAIRRO)+' '+AllTrim(A2_MUN)),1,49),oArial08n,100)
	oPrint:Say(_nLin,2100,SA2->A2_EST,oArial08N,100)
	oPrint:Say(_nLin,2200,SA2->A2_CEP,oArial08N,100) ; _nLin += 60

	oPrint:Box(_nLin,0145,_nLin+100,_ColFim)
	oPrint:Box(_nLin,1235,_nLin+200,1235) ; _nLin += 10
	oPrint:Say(_nLin,0170,"CNPJ / CPF:",oArial08,100)
	oPrint:Say(_nLin,1250,"Inscrição Estadual:",oArial08,100) ; _nLin += 30
	oPrint:Say(_nLin,0170,AllTrim(Transform(SA2->A2_CGC,'@R 99.999.999/9999-99')),oArial08n,100)
	oPrint:Say(_nLin,1250,AllTrim(Transform(SA2->A2_INSCR,'@R 99.999.999/999-99')),oArial08n,100) ; _nLin+= 60

	oPrint:Box(_nLin,0145,_nLin+100,_ColFim) ; _nLin += 10
	oPrint:Say(_nLin,0170,"E-mail:",oArial08,100)
	oPrint:Say(_nLin,1250,"Telefones:",oArial08,100) ; _nLin += 30
	oPrint:Say(_nLin,0170,Lower(SA2->A2_EMAIL),oArial08n,100)
	oPrint:Say(_nLin,1250,SA2->("("+A2_DDD+") "+AllTrim(A2_TEL)+" "+AllTrim(A2_FAX)),oArial08n,100) ; _nLin += 60

	// CONTATOS DO FORNECEDOR
	_cCodFor := SC7->(C7_FORNECE+C7_LOJA)
	AC8->( DbSetOrder(2) ) // filial + entidade + filial entidade + codigo entidade
	If ( AC8->( DbSeek(xFilial('AC8')+"SA2"+xFilial("SA2")+_cCodFor) ) )

		oPrint:Box(_nLin,0145,_nLin+100,_ColFim) ; _nLin += 10
		oPrint:Say(_nLin,0170,"Contatos:",oArial08,100); _nLin += 30
		_cContatos := ""

		While AllTrim(AC8->AC8_CODENT) == AllTrim(_cCodFor)

			SU5->( DbSetOrder(1) )
			If !Empty( Posicione('SU5',1,xFilial('SU5')+AC8->AC8_CODCON,"U5_EMAIL" ) )
				_cContatos := SU5->( AllTrim(U5_CONTAT)+" "+AllTrim(U5_EMAIL)+U5_DDD+IIF(!Empty(U5_CELULAR),AllTrim(U5_CELULAR),"")+" "+IIF(!Empty(U5_FONE),AllTrim(U5_FONE),"")+" "+IIF(!Empty(U5_FCOM1),AllTrim(U5_FCOM1),"")+" "+IIF(!Empty(U5_FCOM2),AllTrim(U5_FCOM2),"")  )
			Endif
			AC8->( DbSkip() )
			If AllTrim(AC8->AC8_CODENT) == AllTrim(_cCodFor)
				_cContatos += " / "
			Endif

		Enddo
		oPrint:Say(_nLin,0170,_cContatos,oArial08n,100)  ; _nLin += 80

	Endif

	If _nCont > 0
		fCabProd()
	Endif
	_nLin += 80

Return Nil

/*______________________________________________________________________________
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¦¦+--------------------------------------------------------------------------+¦¦
¦¦¦Função     ¦ fRodape      ¦ Autor ¦ Luciano Camargo   ¦ Data ¦ 14/03/2012 ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦Descrição  ¦ Monta o Rodape                                               ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*/
Static Function fCabProd()

	// DO OBJETO CONTRATADO
	_nLin += 20
	oPrint:Say(_nLin,0170,"DO OBJETO CONTRATADO",oArial10n,100) ; _nLin += 50
	oPrint:Say(_nLin,0170,"Natureza: " + AllTrim(_aDados[1][12]) ,oArial08n); _nLin += 30 // PEGAR APENAS UM CAMPO NA TABELA

	_nLin += 20
	oPrint:Box(_nLin,0145,_nLin+100,_ColFim)
	oPrint:Box(_nLin,0245,_nLin+100,0245) // item / codigo
	oPrint:Box(_nLin,1320,_nLin+100,1320) // codigo/C/CUSTO
	oPrint:Box(_nLin,1470,_nLin+100,1470) // C/CUSTO / UM
	oPrint:Box(_nLin,1630,_nLin+100,1630) // UM / QTDE
	oPrint:Box(_nLin,1780,_nLin+100,1780) // QTDE / Val. Unit.
	oPrint:Box(_nLin,1930,_nLin+100,1930) // Val Unitario / Val. Total
	oPrint:Box(_nLin,2080,_nLin+100,2080) // Val IPI
	oPrint:Box(_nLin,2230,_nLin+100,2230) // Total com IPI

	_nLin += 30
	oPrint:Say(_nLin,0160,"ITEM",oArial08n,100)
	oPrint:Say(_nLin,0270,"CÓDIGO / DESCRIÇÃO E OBS DO OBJETO CONTRATADO",oArial08n,100)
	//oPrint:Say(_nLin,1330,"C/CUSTO",oArial08n,100)
	oPrint:Say(_nLin,1530,"UM",oArial08n,100)
	oPrint:Say(_nLin,1675,"QTDE",oArial08n,100)
	oPrint:Say(_nLin,1785,"VAL.UNIT.",oArial08n,100)
	oPrint:Say(_nLin,1960,"TOTAL",oArial08n,100)
	oPrint:Say(_nLin,2150,"IPI",oArial08n,100)
	oPrint:Say(_nLin,2240,"TOTAL+IPI",oArial08n,100) ; _nLin += 30

Return

/*______________________________________________________________________________
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¦¦+--------------------------------------------------------------------------+¦¦
¦¦¦Função     ¦ fRodape      ¦ Autor ¦ Luciano Camargo   ¦ Data ¦ 14/03/2012 ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦Descrição  ¦ Monta o Rodape                                               ¦¦¦
¦¦+-----------+--------------------------------------------------------------+¦¦
¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*/
Static Function fRodape()

	// DO TERMO DA CONTRATACAO
	_nLin += 10
	VerNewPag()
	oPrint:Say(_nLin,0170,"DO TERMO DA CONTRATAÇÃO",oArial10n,100)
	_nLin += 50
	VerNewPag(_nLin+570) ; oPrint:Box(_nLin,0145,_nLin+650,_ColFim) ; _nLin += 10
	VerNewPag() ; oPrint:Say(_nLin,0170,"1.	O presente Termo tem como objeto o fornecimento dos bens e/ou a prestação dos serviços, para a "+_cNmEmpr+", listados acima. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"2.	O serviço ora contratado será remunerado na data e pela quantia discriminada acima. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"3.	A assinatura no canhoto de recebimento da Nota Fiscal atesta as quantidades fornecidas, porem não implica em aprovação do fornecimento entregue, ficando o ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0195,"material sujeito ainda a inspeção de qualidade por parte da "+_cNmEmpr+". ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"4.	A "+_cNmEmpr+" tem o direito de não aceitar a entrega de qualquer bem e/ou serviço que: ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0200,"4.1.	Esteja fora das especificações de embalagem, peso, medidas técnicas e/ou de qualidade descritas acima. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0200,"4.2.	Apresente sinais evidentes de deterioração, desgaste, danificação ou incorreções. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0200,"4.3.	Seja entregue após o prazo de entrega definido acima. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0200,"4.4.	Que não esteja acompanhado da respectiva Nota Fiscal, emitida em nome da "+_cNmEmpr+" e que espelhe fielmente as condições expressas acima. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"5.	A "+_cNmEmpr+" se reserva ao direito de desconsiderar qualquer compra que não tenha sido solicitada através deste Termo e de seu anexo,devidamente preenchido e autorizado " ,oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"   pela "+_cNmEmpr+".",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"6.	A aceitação excepcional, por parte da "+_cNmEmpr+", de qualquer compra e/ou serviço que não atenda a alguma das clausulas acima, não implica em abdicação dos direitos  ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0195,"acordados pela aceitação do presente Termo. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"7.	A "+_cNmEmpr+" reserva-se ao direito de considerar sem efeito o presente Termo, portanto, nulas quaisquer obrigações comerciais e/ou financeiras dele decorrente, caso ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0195,"venha a ocorrer alguma das hipóteses acima discriminadas. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"8.	O Fornecedor retro - qualificado declara ter pleno conhecimento e concordância integral do presente Termo, comprometendo-se com o seu cumprimento. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"9.	A aceitação do presente se dará pela Contratada através de e-mail enviado a "+_cNmEmpr+" para o endereço eletrônico: "+_eMailCOM+", ou mediante ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0195,"assinatura deste e enviado, por correio, para a "+_cNmEmpr+", e com isso, surtindo para todos os efeitos legais e necessários a sua completa existência, eficácia e validade. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"10. Presume-se que as embalagens contëm as quantidades declaradas dado que esta aferição é responsabilidade primária do fornecedor. ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"11. Importante: O Fornecedor ao aceitar esse pedido, se compromete a fornecer os produtos ou serviços exatamente iguais ao expecificados pela "+_cNmEmpr+" sem qualquer ",oArial08,100); _nLin += 30
	VerNewPag() ; oPrint:Say(_nLin,0170,"   alteração ou variação. ",oArial08,100); _nLin += 30

	_nLin += 40
	If MV_PAR02 = 1
		// DADOS PARA EMISSAO DA NOTA FISCAL
		VerNewPag() ; oPrint:Say(_nLin,0170,"DADOS PARA EMISSÃO DA NOTA FISCAL",oArial10n,100) ; _nLin += 50
		VerNewPag(_nLin+100) ; oPrint:Box(_nLin,0145,_nLin+100,_ColFim)
		oPrint:Box(_nLin,1435,_nLin+100,1435)
		oPrint:Box(_nLin,1980,_nLin+100,1980) ; _nLin += 10

		VerNewPag() ; oPrint:Say(_nLin,0170,"Razão Social / Nome:",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,1450,"CNPJ / CPF:",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,2000,"Inscrição Estadual:",oArial08,100) ; _nLin += 30

		VerNewPag() ; oPrint:Say(_nLin,0170,AllTrim(SM0->M0_NOMECOM),oArial08n,100)
		VerNewPag() ; oPrint:Say(_nLin,1450,AllTrim(Transform(SM0->M0_CGC,'@R 99.999.999/9999-99')),oArial08n,100)
		VerNewPag() ; oPrint:Say(_nLin,2000,AllTrim(Transform(SM0->M0_INSC,'@R 99.999.999/999-99')),oArial08n,100); _nLin += 60

		VerNewPag( _nLin+100 ) ; oPrint:Box(_nLin,0145,_nLin+100,_ColFim) ; _nLin += 10
		VerNewPag() ; oPrint:Say(_nLin,0170,"Endereço:",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,1450,"Bairro / Cidade:",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,2100,"UF:",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,2200,"CEP:",oArial08,100) ; _nLin += 30
		VerNewPag() ; oPrint:Say(_nLin,0170,SM0->(AllTrim(M0_ENDENT)+" "+AllTrim(M0_COMPENT)),oArial08n,100)
		VerNewPag() ; oPrint:Say(_nLin,1450,AllTrim(SM0->M0_BAIRENT)+" "+AllTrim(SM0->M0_CIDENT),oArial08n,100)
		VerNewPag() ; oPrint:Say(_nLin,2100,AllTrim(SM0->M0_ESTENT),oArial08n,100)
		VerNewPag() ; oPrint:Say(_nLin,2200,AllTrim(SM0->M0_CEPENT),oArial08n,100) ; _nLin += 60

		VerNewPag(_nLin+100) ; oPrint:Box(_nLin,0145,_nLin+100,_ColFim) ; _nLin += 10
		VerNewPag() ; oPrint:Say(_nLin,0170,"E-mail:",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,1250,"Telefones:",oArial08,100) ; _nLin += 30
		VerNewPag() ; oPrint:Say(_nLin,0170,_eMailNFE,oArial08n,100)
		//oPrint:Say(_nLin,1250,AllTrim(SM0->M0_TEL),oArial12n,100) ; _nLin += 90
		VerNewPag() ; oPrint:Say(_nLin,1250,AllTrim(SM0->M0_TEL),oArial08n,100) ; _nLin += 70

		VerNewPag() ; oPrint:Say(_nLin,0170,"Obs. 1 - A Nota Fiscal deve conter obrigatoriamente: ",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,1135,"Obs. 2 - A Nota Fiscal que não tiver os dados acima listados estará sujeita a devolução. ",oArial08,100) ; _nLin += 30
		VerNewPag() ; oPrint:Say(_nLin,0250,"1.1 - O número do PEDIDO DE COMPRAS.",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,1135,"Obs. 3 - A Nota Fiscal deverá ser entregue no endereço acima, no setor de Compras",oArial08,100) ; _nLin += 30
		VerNewPag() ; oPrint:Say(_nLin,0250,"1.2 - Os dados bancários para pagamento.",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,1135,"e Suprimentos, ou enviada para o endereço eletrônico: "+_eMailNFE,oArial08,100) ; _nLin += 30
		VerNewPag() ; oPrint:Say(_nLin,0250,"1.3 - A forma de pagamento.",oArial08,100)
		VerNewPag() ; oPrint:Say(_nLin,1135,+"conforme nosso manual de fornecedor.",oArial08,100) ; _nLin += 30
		VerNewPag() ; oPrint:Say(_nLin,0250,"1.4 - A data de vencimento.",oArial08,100)

		VerNewPag( _nLin+20 ) ;_nLin += 20
	Endif

	// DE ACORDO
	_nLin += 0090
	_nLinold := _nLin
	VerNewPag()
	if(_nLin==_nLinold)
		_nLin -= 0090
	endif
	oPrint:Say(_nLin+10,0170,"DE ACORDO",oArial10n,100) ; _nLin += 0090
	VerNewPag() ; oPrint:Say(_nLin,0170,"DATA: _______________, ____ de __________________ de __________",oArial08,100)
	VerNewPag() ; oPrint:Say(_nLin,1500,"____________________________________________________",oArial10n,100); _nLin += 50
	VerNewPag() ; oPrint:Say(_nLin,1500,AllTrim(Transform(SA2->A2_CGC,'@R 99.999.999/9999-99'))+" "+Substr(AllTrim(SA2->A2_NOME),1,40),oArial08n,100)

	/*______________________________________________________________________________
	¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
	¦¦+--------------------------------------------------------------------------+¦¦
	¦¦¦Função     ¦ VerNewPag    ¦ Autor ¦ Luciano Camargo   ¦ Data ¦ 26/07/2012 ¦¦¦
	¦¦+-----------+--------------------------------------------------------------+¦¦
	¦¦¦Descrição  ¦ Verificar necessidade do salta de pagina
	¦¦+-----------+--------------------------------------------------------------+¦¦
	¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
	¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯*/
Static Function VerNewPag( nBox )
	Default nBox := 0

	// Verifica Salto de Pagina se houver muitos itens
	if _nLin > 3200 .or. nBox > 3200
		oPrint:Say(_nLin   ,2260,"(Continua...)",oArial09)
		oPrint:EndPage()
		_nLin  := 100
		fCabecalho()
		oPrint:Say(_nLin   ,0170,"(Continuação)",oArial09)
		_nLin += 100
		//fCabProd()
	endif