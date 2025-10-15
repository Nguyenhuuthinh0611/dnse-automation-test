// Create an input element for file upload
const inputElement = document.createElement('input');
inputElement.type = 'file';
inputElement.accept = '.xlsx, .xls'; // Accept Excel files

// Add an event listener to handle file selection
inputElement.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const filePath = '\\Users\\ADMIN\\Downloads\\BÁO CÁO KQKD FX LONG BIÊN  2025 ( Lũy kế 10.10.2025)';
        console.log('File path:', filePath);

        const reader = new FileReader();

        // Read the file as binary string
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = e.target?.result;
            if (data) {
            console.log('File uploaded successfully:', filePath);
            // Process the Excel file data here
            }
        };

        reader.onerror = (e) => {
            console.error('Error reading file:', e);
        };

        reader.readAsBinaryString(file);
