const fs = require('fs')
const path = require('path')

const supportedLanguages = [ 'csharp', 'python', 'typescript' ]
const configFileTemplate = `openapi-{{language}}-config.json`

function updateConfigVersion(filename, version) {
    const filePath = path.join(process.cwd(), `sdk-generation-configuration/${filename}`)
    const config = JSON.parse(fs.readFileSync(
        filePath,
        'utf8'))

    console.log('initial config', config)

    config.packageVersion = version
    
    console.log('updated config', config)

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8')
}

function updateTypescriptConfigVersion(filename, version) {
    const filePath = path.join(process.cwd(), `sdk-generation-configuration/${filename}`)
    const config = JSON.parse(fs.readFileSync(
        filePath,
        'utf8'))

    console.log('initial config', config)

    config.npmVersion = version 

    console.log('updated config', config)

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8')
}

function updateAllConfigsToLatesVersion(version) {
    for (const language of supportedLanguages) {
        console.log("Language", language, version)

        const stringVersion = `${version.major}.${version.minor}.${version.patch}`
        console.log('string version', stringVersion)
        
        const filename = configFileTemplate.replace("{{language}}", language)
        console.log('filename', filename)

        if (language === 'typescript') 
            updateTypescriptConfigVersion(filename, stringVersion)
        else 
            updateConfigVersion(filename, stringVersion)
    }
}

module.exports = {
    updateAllConfigsToLatesVersion
}