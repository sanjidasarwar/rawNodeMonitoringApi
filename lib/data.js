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

module.exports=lib