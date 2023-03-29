import { useState } from "react";
import axios from 'axios';
import "./FileUpload.css"
const FileUpload=({contract,account,provider})=>{
    const [file,setFile]=useState(null);
    const [fileName,setFileName]=useState("no file selected");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(file)
        {
            try{
                const formData=new FormData();
                formData.append("file",file);
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                      pinata_api_key:`d2d5585d62bf2f27a284`,
                      pinata_secret_api_key: `d1ef4f10ad09b15d63d3ddcdfddac67628e1fced7fda600c79c4ccc5e415ff1a`,
                      "Content-Type": "multipart/form-data",
                    },
                  });
                  const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                  const signer = contract.connect(provider.getSigner());
                  signer.add(account, ImgHash);
                  alert("Successfully Image Uploaded");
                  setFileName("No image selected");
                  setFile(null);

            }catch(e){
                alert("unable to upload")
            }
        }

    }
    const retrieveFile=(e)=>
    {
        const data=e.target.files[0];
        
        const reader=new window.FileReader();
        reader.readAsArrayBuffer(data)
        reader.onloadend=()=>{
            setFile(e.target.files[0]);

        }  
        setFileName(e.target.files[0].name);
        e.preventDefault();

    }
    return <div className="top">
        <form className="form" onSubmit={handleSubmit}>
            <input disabled={!account} type="file" id="file-upload" name="data" onChange={retrieveFile}/>
            <label htmlFor="file-upload" className="choose">Choose Image</label>
            <span className="textArea">Image: {fileName}</span>
            <button type="submit" className="upload">upload</button>
        </form>

    </div>
    
};
export default FileUpload;