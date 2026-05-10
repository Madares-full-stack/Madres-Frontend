"use client";

import api from "@/api";
import Footer from "@/app/component/Footer";
import Navbar from "@/app/component/Navbar";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [classes, setClasses] = useState(null);
  const { id } = useParams();
  const Router =useRouter();
  const getClass = async () => {
    try {
      const res = await api.get(`/classes/${id}`);
      setClasses(res.data.class);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (id) {
      getClass();
    }
  }, [id]);

  if (!classes) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar/>
    <div className="container mt-5 text-white">
      <div className="card-dark p-4 rounded">
        <h1>{classes.name}</h1>

        <h5 className="mt-3">
          Teacher: {classes.teacher?.name}
        </h5>

        <h5 className="mt-4">Students</h5>

        {classes.students?.length > 0 ? (
          <ul>
            {classes.students.map((student) => (
              <li key={student._id}>
                {student.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No students found</p>
        )}
         <button className="btn btn-success" onClick={()=>{
            Router.back()
         }}>Back</button>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Page;