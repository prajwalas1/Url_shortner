import { UrlState } from '@/context';
import React, { useEffect, useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import Error from './error';
import { Card } from './ui/card';
 import * as yup from 'yup'; 
import useFetch from '@/hooks/use-fetch';
import { createUrl } from '@/db/apiUrls';
import { BeatLoader } from 'react-spinners';

const CreateLink = () => {
    const {user} = UrlState();
    const navigate = useNavigate();
    const ref = useRef();
    let [searchParams,setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    const [errors,setErrors] = useState({});
    const [formValues , setFormValues] = useState({
        title: "",
        longUrl: longLink ? longLink : "",
        customUrl: "",
    });

    const schema = yup.object().shape({
        title:yup.string().required("Title is required"),
        longUrl:yup.string()
        .url("Must be a valid URL")
        .required("Long URL is required"),
        customUrl:yup.string(),
    });

     const handleChange = (e) => {
        setFormValues({
          ...formValues,
          [e.target.id]: e.target.value,  
        });
     };

    const {loading,error,data,fn:fnCreateUrl} = useFetch(createUrl,{...formValues, user_id:user.id});

     const createNewLink = async() => {
        setErrors([]);
        try{
            await schema.validate(formValues,{abortEarly:false});
            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));

            await fnCreateUrl(blob);

        }catch(e){
            const newErrors = {};
            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });

            setErrors(newErrors);

        }

     };

     useEffect(() => {
        if (error === null && data) {
          navigate(`/link/${data[0].id}`); 
        } 
      }, [error, data]);
      



  return (
    <Dialog
    defaultOpen={longLink}
    onOpenChange={(res) => {
      if (!res) setSearchParams({});
    }}
  >
  <DialogTrigger>
    <Button variant="destructive">Create New Link</Button>
  </DialogTrigger>
  <DialogContent className = "sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">Create New</DialogTitle>
    </DialogHeader>
    {formValues?.longUrl && (
        <QRCode value={formValues?.longUrl} size={250} ref={ref}/>
    )}
    <Input id="title" placeholder="Short Link's Title"
     value={formValues.title}
     onChange={handleChange}/>
    {errors.title && <Error message={errors.title}/>}
    <Input id="longUrl" placeholder="Enter your Looong URL"
     value={formValues.longUrl}
     onChange={handleChange}/>
     {errors.longUrl && <Error message={errors.longUrl}/>}
    <div className='flex items-center gap-2'>
      <Card className="p-2">trimmr.in</Card> / 
    <Input id="customUrl" placeholder="Custom Link (optional)"
    value={formValues.customUrl}
    onChange={handleChange}/>
    </div>
    {error && <Error message={errors.customUrl}/>}
    <DialogFooter className="sm:justify-start">
        <Button onClick = {createNewLink} variant="destructive" className="submit" disabled = {loading}>
            {loading ? <BeatLoader size={10} color='white'/>: "Create"}
        </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>  
    
  )
};
     
export default CreateLink;