'use client'
import React, { useEffect, useState } from 'react'
import CourseInformat from "./CourseInformat"
import CourseOptions from "./CourseOptions"
import CourseData from "./CourseData"
import CourseContent from "./CourseContent"
import CoursePreview from "./CoursePreview"
import { useCreateCourseMutation } from '@/redux/features/courses/coursesApi'
import toast from 'react-hot-toast'
import { redirect } from 'next/navigation'
import { useLoadUserQuery } from '@/redux/features/api/apiSilce' 

type Props = {}

const CreateCourse = (props: Props) => {

    const[createCourse,{isLoading, isSuccess,error}] = useCreateCourseMutation();
    const {data:userReload , refetch:refetchUser } = useLoadUserQuery({});

    const [active, setActive] = useState(0);
    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price : "",
        estimatedPrice: "",
        tags: "",
        level: "",
        category: "",
        demoUrl: "",
        thumbnail: "",
        creator:""
    })

    const [benefits, setBebefits] = useState([{title: ""}]);
    const [prerequisites, setPrerequisites] = useState([{title: ""}]);
    const [courseContentData, setCourseContentData] = useState([{
        videoUrl: "",
        assignmentFile:"",
        title: "",
        description: "",
        videoSection: "Untitled Section",
        videoLength:"",
        links: [
            {
                title: "",
                url: "",
            },
        ],
        suggestion: "",
    },
]);


    
 const[courseData, setCourseData] = useState({});

    const handleSubmit= async () => {
       //format benefits array
       const formattedBenefits = benefits.map((benefits) => ({title:benefits.title}));
       //format prerequisites
       const formattedPrerequisites = prerequisites.map((prerequisites) => ({title:prerequisites.title}));
       //format course content array
       const formattedcourseContentData = courseContentData.map((courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoLength: courseContent.videoLength,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
            title: link.title,
            url: link.url,
        })),
        suggestion: courseContent.suggestion,
        assignmentFile:courseContent.assignmentFile
       }));
       //prepare ourr data object
       const data = {
        name: courseInfo.name,
        description: courseInfo.description,
        price: courseInfo.price,
        category: courseInfo.category,
        estimatedPrice: courseInfo.estimatedPrice,
        tags: courseInfo.tags,
        thumbnail: courseInfo.thumbnail,
        level: courseInfo.level,
        demoUrl: courseInfo.demoUrl,
        totaVideos: courseContentData.length,
        benefits: formattedBenefits,
        prerequisites: formattedPrerequisites, // Đảm bảo mảng này có cấu trúc đúng
        courseData: formattedcourseContentData,
        creator : userReload.user._id
       };
       setCourseData(data);
    };


     useEffect(() => {
        if(isSuccess){
            toast.success("Course created successfully");
            redirect("/teacher/courses");
        }
        if(error){
            if("data" in error){
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    },[isLoading, isSuccess,error])


    const handleCourseCreate = async (e:any) => {
        const data = courseData;
        if(!isLoading){
            await createCourse(data)
        }
    };

    return ( 
        <div className="w-full flex min-h-screen">
            <div className="w-[80%]">
                {
                    active === 0 && (
                        <CourseInformat
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
                        />
                    )
                }
                {
                    active === 1 && (
                        <CourseData
                        benefits={benefits}
                        setBenefits={setBebefits}
                        prerequisites={prerequisites}
                        setPrerequisites={setPrerequisites}
                        active={active}
                        setActive={setActive}
                        />
                    )
                }
                 {
                    active === 2  && (
                        <CourseContent
                        active={active}
                        setActive={setActive}
                        courseContentData={courseContentData}
                        setCourseContentData={setCourseContentData}
                        handleSubmit={handleSubmit}
                        />
                    )
                }
                {
                    active === 3  && (
                        <CoursePreview
                        active={active}
                        setActive={setActive}
                        courseData={courseData}
                        handleCourseCreate={handleCourseCreate}
                        />
                    )
                }
            </div>
            <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
                <CourseOptions active={active} setActive={setActive} />
            </div>
        </div>
    )
}

export default CreateCourse