// module scaffolding
const environments={}

environments.staging={
    port: 3000,
    envName:'staging',
    secretKey:'asdskjk'
}

environments.production={
    port: 5000,
    envName:'production',
    secretKey:'kjjlks;da'
}

const currentenvironments =typeof process.env.NODE_ENV ==='string' ? process.env.NODE_ENV.trim() : 'staging'

const environmentsToExport = typeof environments[currentenvironments] === 'object' ? environments[currentenvironments] :environments.staging

module.exports =environmentsToExport