const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/assets/cv_andreas_sandnes.pdf';
    link.download = 'cv_andreas_sandnes.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default handleDownload;