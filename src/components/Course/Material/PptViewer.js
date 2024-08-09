import { useEffect, useRef, useState } from 'react';

export default function PptViewerComponent(prop) {
    const [error, setError] = useState(null);
    const { material } = prop;
    const [viewpdf, setViewPdf] = useState(material);
    useEffect(() => {
        setViewPdf(material)
    }, [material])
    const [documentPath, setDocumentPath] = useState('');
    const containerRef = useRef(null);
    useEffect(() => {

        setDocumentPath(viewpdf);


    }, [viewpdf]);

    useEffect(() => {
        const container = containerRef.current;
        let instance, PSPDFKit;
        (async function () {
            if (documentPath) {
                PSPDFKit = await import('pspdfkit');
                PSPDFKit.unload(container);

                instance = await PSPDFKit.load({
                    container,
                    document: documentPath,
                    baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
                });
            }
        })();

        return () => PSPDFKit && PSPDFKit.unload(container);
    }, [documentPath]);

    return (
        <div
            ref={containerRef}
            style={{ width: '40vw', height: '90vh', marginTop: 10 }}
        />
    );
}