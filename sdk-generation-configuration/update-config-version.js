const fs = require('fs')

const supportedLanguages = [ 'csharp', 'python', 'typescript' ]
const configFileTemplate = `openapi-{{language}}-config.json`

function updateConfigVersion(filename, version) {
    const config = JSON.parse(fs.readFileSync(
        path.join(process.cwd(), `sdk-generation-configuration/${filename}`),
        'utf8'))

    console.log('initial config', config)

    config.packageVersion = version
    
    console.log('updated config', config)

    fs.writeFileSync(filename, config)
}

function updateTypescriptConfigVersion(filename, version) {
    const config = JSON.parse(fs.readFileSync(
        path.join(process.cwd(), `sdk-generation-configuration/${filename}`),
        'utf8'))

    console.log('initial config', config)

    config.npmVersion = version 

    console.log('updated config', config)

    fs.writeFileSync(filename, config)
}

function updateAllConfigsToLatesVersion(version) {
    for (const language in supportedLanguages) {
        console.log("Language", language, version)

        const stringVersion = `${version.major}.${version.minor}.${version.patch}`
        console.log('string version', stringVersion)
        
        const filename = configFileTemplate.replace("{{language}}", language)

        if (language === 'typescript') 
            updateTypescriptConfigVersion(filename, stringVersion)
        else 
            updateConfigVersion(filename, stringVersion)
    }
}

module.exports = {
    updateAllConfigsToLatesVersion
}