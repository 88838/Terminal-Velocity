let stage;
const stagesInfo = [];

/*there will always be three pages, so this can be a constant*/
/*const stageImageCount = 4;*/
/*the images will be stored in an array*/
/*const stageImages = [];*/

/*like before, a promise function is needed to make sure the images load at the beginning of the game*/
/*let loadStageImage = new Promise(function(resolve) {
    /!*the amount of images that have loaded starts of as 0*!/
    let loadedImageCount = 0;

    let loadCheck = function() {
        /!*each time this function is run, the amount of loaded images goes up by 1*!/
        loadedImageCount++;
        if (loadedImageCount === stageImageCount) {
            /!*once there are 3 loaded images, the promise is resolved*!/
            resolve();
        }
    };
    /!*in this for loops i goes from 1 to 3 *!/
    for (let i = 1; i <= 4; i++) {
        /!*a temporary image variable is initialised*!/
        let image = new Image();
        /!*the image file is loaded, corresponding to the value of i in the loop*!/
        image.src = "/client/img/stage" + i + ".png";
        /!*once the image has loaded, the loadCheck function is run to increase the number of loaded images*!/
        image.onload = () => loadCheck();
        /!*finally, the image is pushed onto the stageImages array*!/
        stageImages.push(image);
    }
});*/

let loadStagesInfo = new Promise(function(resolve) {
    let loadedImageCount = 0;
    let loadCheck = function(stagesDb) {
        loadedImageCount++;
        if (loadedImageCount === stagesDb.length) {
            resolve();
        }
    };
    fetch('/stages/list' , {method: 'get'}
    ).then(response => response.json()
    ).then(stagesDb => {
        for (let stageDb of stagesDb) {
            let image = new Image();
            image.src = stageDb.imageFile;
            image.onload = () => loadCheck(stagesDb);
/*            console.log(stageDb.stageid + " " + image + " " + stageDb.locationY)*/
            /*the monsterInfo array is pushed in the same way the skinImages were pushed*/
            /*this time, all of the attributes from the database apart from the name are pushed instead of just the id and the file name*/
            stagesInfo.push([stageDb.stageid, image, stageDb.locationY]);
        }
    });
});

class Stage{
    /*the id is passed into the constructor*/
    constructor(stageid, image) {
        this.stageid = stageid;
        /*the image is set to the id-1 because arrays start with the index 0*/
        this.image = image;
        /*the starting y coordinate is in the middle of the canvas*/
        this.y = ph/2;
        /*the stage is scrolling upwards, so it has a negative velocity*/
        this.dy = -200;
    }

    draw(context){
        if (!player.alive) return;
        /*the first image is drawn in the centre*/
        context.drawImage(this.image, 0, this.y - this.image.height/2);
        /*the second image is offset by the full image height below the first image*/
        context.drawImage(this.image, 0, this.y + this.image.height/2);
    }

    update(frameLength) {
        if (!player.alive) return;
/*        this.image = stageImages[this.stageid-1];*/
        /*when the y coordinate travels 595 pixels upwards (the whole height of the image -5, to account for frame skipping), then the y coordinate is reset*/
        if(this.y <= (-this.image.height/2+5)) this.y = ph/2;
        this.y += frameLength * this.dy;
    }

    setImage(){
        /*if the player's */
        for (let stageInfo of stagesInfo){
            if(player.artificialY >= stageInfo[2]){
                this.stageid = stageInfo[0];
                this.image = stageInfo[1];
            }
        }
    }
}