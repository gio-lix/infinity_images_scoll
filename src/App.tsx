import React, {useEffect, useRef, useState} from 'react';
import './App.scss';
import axios from "axios";
import {PhotosState} from "./typing";

function App() {
    const [photos, setPhotos] = useState<PhotosState[]>([])
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [loading, setLoading] = useState(false)

    const Access_key = "1SO48FE0MZ-4aRlVSCyKJxLxFAOYxMj7yyp4S5C8-LU"

    const fetchPhotos = async (pageNumber: number) => {
        const {data} = await axios.get(`https://api.unsplash.com/photos/?client_id=${Access_key}&page=${pageNumber}&per_page=10`)
        setPhotos((prev: PhotosState[]) => [...prev, ...data])
        setLoading(true)
    }

    const loadMore = () => {
        setPageNumber(prev => prev + 1)
    }

    useEffect(() => {
        fetchPhotos(pageNumber)
    }, [pageNumber])

    const pageEnd = useRef<HTMLButtonElement | null>(null)

    let num = 1
    useEffect(() => {
        if (loading) {
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    num++
                    loadMore()
                    if (num >= 5) {
                        pageEnd.current && observer.observe(pageEnd.current)
                    }
                }
            }, {threshold: 1});
            pageEnd.current && observer.observe(pageEnd.current)
        }
    }, [loading])


    function getSpanEstimate(size: number) {
        if (size > 5000) return 2
        return 1
    }

    return (
        <main>
            <h1>Infinity scroll</h1>
            <section className="imageSection">
                {photos.map((photo: PhotosState, index: number) => {
                    return (
                                <div
                                    style={{
                                        gridColumnEnd: `span ${getSpanEstimate(photo.width)}`,
                                        gridRowEnd: `span ${getSpanEstimate(photo.height)}`
                                    }}
                                    key={index}
                                >
                                    <img
                                        src={photo.urls.small}
                                        alt="photo"
                                        className="imageBox"
                                    />
                                    <p className="info">
                                        {photo.user.first_name}
                                        {"  "}
                                        {photo.user.last_name}
                                    </p>
                                </div>
                    )
                })}
                <div className="loading">
                    <p>
                        loading...
                    </p>
                    <button
                        onClick={loadMore}
                        ref={pageEnd}
                    > </button>
                </div>
            </section>
        </main>
    );
}

export default App;
