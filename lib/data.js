// dependencies
const path=require('path')
const fs=require('fs')

// module scaffolding
lib={}

lib.baseDirectory = path.join(__dirname, '../.data/')

lib.createFile = (dir, file,data, callback )=>{
    const filePath =`${lib.baseDirectory+dir}/${file}.json`
    fs.open(filePath, 'wx', (err, fileDescriptor)=>{
        if(err){
           return callback('There was an error, file may already exists!')
        }
        const stringData = JSON.stringify(data)

            fs.write(fileDescriptor, stringData, (writtenErr) =>{
                if(writtenErr){
                   return callback('Error, writing in new file') 
                }
                fs.close(fileDescriptor, (closeErr)=>{
                    if (closeErr) {
                       return callback('Error closing the new file!');
                    } 
                    callback(false);

                })
            })

    })
}

lib.read= (dir, file, callback)=>{
    const filePath =`${lib.baseDirectory+dir}/${file}.json`

    fs.readFile(filePath,'utf8', (err, data)=>{
        callback(err, data)

    })
}

lib.update=(dir, file, data, callback)=>{
    const filePath =`${lib.baseDirectory+dir}/${file}.json`

    fs.open(filePath, 'r+', (err, fileDescriptor)=>{
        if(err){
            return callback('Error in open file')
        }
        const stringData = JSON.stringify(data)
        
        fs.ftruncate(fileDescriptor, (err2)=>{
            if(err2){
                callback('Error truncating file!');
            }

            fs.write(fileDescriptor, stringData, (writtenErr)=>{
                if(writtenErr){
                    return callback('Error, writing in new file') 
                }
                
                fs.close(fileDescriptor, (closeErr)=>{
                    if (closeErr) {
                       return callback('Error closing the new file!');
                    } 
                    callback(false);

                })
            })
        })
    })
}

module.exports=lib