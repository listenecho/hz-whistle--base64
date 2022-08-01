
class SecretModal {
    constructor(){
        this.secret = ""
    }
    getSecretKey() {
        return  this.secret
    }

    setSecretKey(key) {
        this.secret = key
    }
}


module.exports = new SecretModal()