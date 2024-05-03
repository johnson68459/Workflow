sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'testlist/test/integration/FirstJourney',
		'testlist/test/integration/pages/TestList',
		'testlist/test/integration/pages/TestObjectPage'
    ],
    function(JourneyRunner, opaJourney, TestList, TestObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('testlist') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheTestList: TestList,
					onTheTestObjectPage: TestObjectPage
                }
            },
            opaJourney.run
        );
    }
);