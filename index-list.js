
        // Main initialization function
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs-491kucYee5DVY_BH7qd9AtK-wLhZXITOZrcSli7sn-nTvnFwpIfB7Oav8YPFGNlavPkxFEDSApS/pub?gid=920142152&single=true&output=csv';

        let data = [];

        async function loadSheet() {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();

        data = parseCSV(csvText);

        renderIndexList();
        }

        // Parse CSV

        function parseCSV(csvText) {
        const rows = [];
        let currentRow = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const nextChar = csvText[i + 1];

            if (char === '"' && insideQuotes && nextChar === '"') {
            currentValue += '"';
            i++;
            } else if (char === '"') {
            insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentValue.trim());
            currentValue = '';
            } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }

            currentRow.push(currentValue.trim());

            if (currentRow.length > 1 || currentRow[0] !== '') {
                rows.push(currentRow);
            }

            currentRow = [];
            currentValue = '';
            } else {
            currentValue += char;
            }
        }

        currentRow.push(currentValue.trim());

        if (currentRow.length > 1 || currentRow[0] !== '') {
            rows.push(currentRow);
        }

        const headers = rows[0].map(header => header.trim());
        const dataRows = [];

        for (let i = 1; i < rows.length; i++) {
            const row = {};

            headers.forEach((header, index) => {
            row[header] = rows[i][index];
            });

            dataRows.push(row);
        }

        return dataRows;
        }

        // Render list 

        const visibleColumns = [
        'number',
        'origin',
        'OG',
        'ENG',
        'INT'
        ];

        function renderIndexList() {
        const container = document.getElementById('index-list');
        let visibleRowIndex = 0;
        const hoverColors = [
        '#0078BF',
        '#FF48B0',
        '#00A95C',
        '#765BA7',
        '#FF6C2F',
        '#FF665E',
        '#82D8D5'
        ];

        const headerLabels = [
        'Nr',
        'Origin',
        'Original',
        'Interpretation',
        'Translation'
        ];

        const headerRow = document.createElement('div');
        headerRow.classList.add('index-row', 'index-header');

        headerLabels.forEach(label => {
        const cell = document.createElement('div');
        cell.classList.add('index-cell');
        cell.textContent = label;
        headerRow.appendChild(cell);
        });

        container.appendChild(headerRow);  

        data.forEach(row => {

        if (row.show !== 'yes') {
            return;
        }            

        const rowElement = document.createElement('div');
        rowElement.classList.add('index-row');
        rowElement.style.setProperty('--row-hover-color', hoverColors[visibleRowIndex % hoverColors.length]);
        visibleRowIndex++;

        visibleColumns.forEach(column => {
            const cell = document.createElement('div');
            cell.classList.add('index-cell');
            cell.textContent = row[column] || '';
            rowElement.appendChild(cell);
        });

        // Expand row

        const detail = document.createElement('div');
        detail.classList.add('index-detail');

        const info = document.createElement('div');
        info.classList.add('index-detail-info');        
        info.textContent = row.wdymInfo || '';
        detail.appendChild(info);   


        const paddedNumber = String(row.number).padStart(2, '0');

        const possibleImages = [
        `imgs/Web_IMG-L-${paddedNumber}.png`,
        `imgs/Web_IMG-R-${paddedNumber}.png`
        ];

        possibleImages.forEach(src => {
        const img = document.createElement('img');
        img.classList.add('index-detail-img');        
        img.src = src;
        img.alt = '';

        img.onerror = function() {
            img.remove();
        };

        detail.appendChild(img);
        });

        rowElement.appendChild(detail);

        rowElement.addEventListener('click', function() {
        rowElement.classList.toggle('open');
        });

        container.appendChild(rowElement);
        });
        }       

        // Image helper

        function getPaddedNumber(number) {
        return String(number).padStart(2, '0');
        }

        // About popup

        function closeAboutPopup() {
        document.getElementById('about-popup').classList.remove('open');
        }

        document.getElementById('about-button').addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        const popup = document.getElementById('about-popup');

        if (popup.classList.contains('open')) {
            closeAboutPopup();
        } else {
            popup.classList.add('open');
        }
        });

        document.addEventListener('click', function() {
        closeAboutPopup();
        });

        document.getElementById('about-popup').addEventListener('click', function(event) {
        event.stopPropagation();
        });

        loadSheet();
