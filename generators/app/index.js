'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
const mkdirp = require('mkdirp');
var yosay = require('yosay');

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}


module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to ' + chalk.red('generator-android-architecture') + ' generator!'
    ));

    var prompts = [{
      name: 'name',
      message: 'What is the name of your app?',
      store: true,
      default: this.appname,
      validate: function (input) {
        if (/^([a-zA-Z0-9_]*)$/.test(input)) {
          return true;
        }
        return 'Your application name cannot contain special characters or a blank space, using the default name instead : ' + this.appname;
      }
    },{
      name: 'displayName',
      message: 'What name will be displayed in the app?',
      store: true,
      default: 'Clean Example',
      validate: input => input.length > 50 ? 'Name is so long' : true,
    }, {
      name: 'url',
      message: 'What\'s the url of the project?',
      store: true,
      default: 'http://example.com',
      validate: input => isURL(input) ? true : 'Url is not valid',
    },{
      name: 'appPackage',
      message: 'What package will you be publishing the app under?',
      validate: function (input) {
        if (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)) {
          return true;
        }
        return 'The package name you have provided is not a valid Java package name.';
      },
      default: 'com.example.clean',
      store: true
    },
    {
      name: 'aboutMessage',
      message: 'What is the about message?',
      store: true,
      default: 'This app is built using Clean Architecture'
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    const architecture = 'android10-clean-architecture';
    const packageDir = this.props.appPackage.replace(/\./g, '/');
    const oldPackageDir = 'com/fernandocejas/android10/sample';

    /**
     * The files to copy
     * @type {[[string]]}
     */
    const copyFiles = [
      ['buildsystem'],
      ['gradle'],
      ['gradlew'],
      ['gradlew.bat'],
      ['LICENSE'],
      [`presentation/src/main/res/drawable`],
      [`presentation/src/main/res/drawable-hdpi`],
      [`presentation/src/main/res/drawable-mdpi`],
      [`presentation/src/main/res/drawable-xhdpi`],
      [`presentation/src/main/res/drawable-xxhdpi`],
    ];

    copyFiles.forEach(([src, dest = src]) => {
      this.fs.copy(`${this.sourceRoot()}/${architecture}/${src}`, `${dest}`, this.props);
    });

    /**
     * The files to template
     * @type {[[string]]}
     */
    const templateFiles = [
      ['README.md'],
      ['local.properties'],
      ['Android-CleanArchitecture.iml'],
      ['gradle.properties'],
      ['settings.gradle'],
      ['build.gradle'],
      ['data/build.gradle'],
      ['domain/build.gradle'],
      ['presentation/build.gradle'],
      ['data/src/main/AndroidManifest.xml'],
      [`data/src/main/java/${oldPackageDir}`, `data/src/main/java/${packageDir}`],
      [`data/src/test/java/${oldPackageDir}`, `data/src/test/java/${packageDir}`],
      [`domain/src/main/java/${oldPackageDir}`, `domain/src/main/java/${packageDir}`],
      [`domain/src/test/java/${oldPackageDir}`, `domain/src/test/java/${packageDir}`],
      [`presentation/src/main/java/${oldPackageDir}`, `presentation/src/main/java/${packageDir}`],
      [`presentation/src/androidTest/java/${oldPackageDir}`, `presentation/src/androidTest/java/${packageDir}`],
      [`presentation/src/main/AndroidManifest.xml`, `presentation/src/main/AndroidManifest.xml`],
      ['data/_.gitignore', 'data/.gitignore'],
      ['data/data.iml'],
      ['data/proguard-rules.pro'],
      ['domain/domain.iml'],
      ['presentation/_.gitignore', 'presentation/.gitignore'],
      ['presentation/presentation.iml'],
      ['presentation/proguard-rules.pro'],
      [`presentation/src/main/res/layout`],
      [`presentation/src/main/res/values`],
      [`presentation/src/main/res/values-w820dp`],
    ];


    templateFiles.forEach(([src, dest = src]) => {
      this.fs.copyTpl(`${this.sourceRoot()}/${architecture}/${src}`, `${dest}`, this.props);
    });


  }
});
