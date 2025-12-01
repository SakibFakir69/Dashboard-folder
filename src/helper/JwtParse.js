



export const parseJwtToken = (token) =>{

    if(!token)
    {
        return "Please Enter Token"
    }
    const base64Url = token.split(".")[1];


    const base64=base64Url?.split("-","+").replace("_","/");

    return JSON.parse(window.atob(base64));
    


}