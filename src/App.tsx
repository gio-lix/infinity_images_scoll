import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from "axios";
import './App.scss';

import {PhotosState} from "./typing";

function App() {
    const [photos, setPhotos] = useState<PhotosState[]>([])
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [loading, setLoading] = useState(false)


    const fetchPhotos = useCallback( async (pageNumber: number) => {
        const {data} = await axios.get(`https://api.unsplash.com/photos/?client_id=${process.env.REACT_APP_SECRET_KEY}&page=${pageNumber}&per_page=10`)
        setPhotos((prev: PhotosState[]) => [...prev, ...data])
        setLoading(true)
    },[pageNumber])

    const loadMore = () => {
        setPageNumber(prev => prev + 1)
    }

    useEffect(() => {
        fetchPhotos(pageNumber)
    }, [pageNumber])

    const pageEnd = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (loading) {
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    loadMore()
                    pageEnd.current && observer.observe(pageEnd.current)
                }
            }, {threshold: 1});
            pageEnd.current && observer.observe(pageEnd.current)
        }
    }, [loading])

    function getSpanEstimate(size: number) {
        if (size >= 5500) return 2
        return 1
    }

    return (
        <main style={{marginTop: "40px"}}>
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
