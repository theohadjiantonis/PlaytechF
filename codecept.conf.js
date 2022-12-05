const { getOutputDir } = require('./common_packages/customFunctions');


exports.config = {
  output: getOutputDir(),
  helpers: {
    Puppeteer: {
      url: 'http://localhost',
      waitForNavigation: 'networkidle0',
      waitForAction: 500,
      waitForTimeout: 1000,
      chrome: {
        args: [ 
          '--headless',
          '--disable-setui-sandbox',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
          '--allow-insecure-localhost',
          '--no-sandbox', 
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        ignoreHTTPSErrors: true
      },
      uniqueScreenshotNames: true
    },
    ChaiWrapper : {
      require: "./wrappers/codeceptjs-chai"
    },
    MochawesomeHelper: {
      require: './helpers/mochawesome-helper.js'
    }
  },
  include: {
    zoopla: './pages/zoopla.js',
    rightmove: './pages/rightmove.js',
    listingPageZoopla: './pages/listingPageZoopla.js',
    listingPageRightmove: './pages/listingPageRightmove.js'
  },
  mocha: {
    reporterOptions: {
      "codeceptjs-cli-reporter": {
        stdout: '-',
        options: {
          verbose: true,
          steps: true
        }
      },
      mochawesome: {
        stdout: `${getOutputDir()}/console.log`,
        options: {
          reportDir: getOutputDir(),
          overwrite: false,
          reportTitle: 'Playtech',
          reportFilename: 'PlaytechReports',
          jsonReport: false,
          steps: true
        }
      },
      "mocha-junit-reporter": {
        stdout: '-',
        options: {
          mochaFile: `${getOutputDir()}/result.xml`,
          outputs: true,
          testsuitesTitle: 'Playtech',
          attachments: true
        },
        "attachments": true 
      }  
    }
  },
  bootstrap: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/**/*.feature',
    steps: [
            './step_definitions/Gherkin_Steps.js'
          ]
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
      uniqueScreenshotNames: true
    },
    stepByStepReport: {
      enabled: true
    }
  },
  name: 'Playtech'
}