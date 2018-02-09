const config = {
	 file_extensions : {
      'image/jpeg' : 'jpg',
      'image/jpg' : 'jpg',
      'image/png' : 'png',
      'image/gif' : 'gif',
      'image/bmp' : 'bmp',
    },
    fileLimits: {
        fileSize: 10000000, //the max file size (in bytes) -> 10 MB
        files: 10 //the max number of file
    },
    image_path: 'assets/images/default-user.png',
    image_name: 'default-user.png',
    allowed_image_extensions : ['image/jpeg','image/jpg','image/png','image/gif','image/bmp','text/csv']
}


module.exports = config;
