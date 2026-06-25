
        // Main initialization function
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs-491kucYee5DVY_BH7qd9AtK-wLhZXITOZrcSli7sn-nTvnFwpIfB7Oav8YPFGNlavPkxFEDSApS/pub?gid=920142152&single=true&output=csv';

        let data = [];
        let index = {left:0, right:0}


        async function loadSheet() {
            const response = await fetch(SHEET_URL);
            const csvText = await response.text();

            data = parseCSV(csvText);

            renderCard('left');
            renderCard('right');

            console.log(data);
            }

            
            // Parse CSV data
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
            
            function renderCard(side) {
                const row = data[index[side] % data.length];
                const img = row[side];
                const isImgFile = img.includes('IMG');
                const gradient = row[`${side}Gradient`];
                const elm = document.getElementById(`card-${side}`);

                elm.classList.remove(
                    'gradient-blue-left',
                    'gradient-blue-right',
                    'gradient-pink-left',
                    'gradient-pink-right',
                    'gradient-green-left',
                    'gradient-green-right',
                    'gradient-purple-left',
                    'gradient-purple-right',
                    'gradient-orange-left',
                    'gradient-orange-right',
                    'gradient-red-left',
                    'gradient-red-right',
                    'gradient-mint-left',
                    'gradient-mint-right',
                    'image-type-img',
                    'image-type-text'
                );

                if (isImgFile) {
                    elm.classList.add('image-type-img');
                } else {
                    elm.classList.add('image-type-text');
                }

                elm.classList.add(gradient);
                elm.style.backgroundImage = `url(${img}), var(--gradient)`;
            }

            // Card counting function left and right
            function changeCard(side) {
                index[side]++;
                renderCard(side);
            }   

            // Surprise button
            function surpriseMe() {
            if (data.length === 0) {
                return;
            }

            const randomLeft = Math.floor(Math.random() * data.length);
            const randomRight = Math.floor(Math.random() * data.length);

            index.left = randomLeft;
            index.right = randomRight;

            renderCard('left');
            renderCard('right');
            }       

            document.getElementById('surprise-button').addEventListener('click', function(event) {
            event.preventDefault();
            surpriseMe();
            });

            // Matchmaker button

            function matchmaker() {
            index.right = index.left;
            renderCard('right');
            }

            document.getElementById('matchmaker-button').addEventListener('click', function(event) {
            event.preventDefault();
            matchmaker();
            });            
            
            // Open wdym popup

            function openWdymPopup() {
            if (index.left !== index.right) {
                return;
            }

            const row = data[index.left % data.length];

            const ENG = row.ENG?.trim();
            const OG = row.OG?.trim();
            const wdymInfo = row.wdymInfo?.trim();

            if (!ENG && !OG && !wdymInfo) {
                return;
            }

            document.getElementById('ENG').textContent = ENG;
            document.getElementById('OG').textContent = OG;
            document.getElementById('wdym-info').textContent = wdymInfo;

            document.getElementById('wdym-popup').classList.add('open');
            }

            document.getElementById('wdym-button').addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const popup = document.getElementById('wdym-popup');

            if (popup.classList.contains('open')) {
                closeWdymPopup();
            } else {
                openWdymPopup();
            }
            });

            // Close wdym popup

            function closeWdymPopup() {
            document.getElementById('wdym-popup').classList.remove('open');
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
            closeWdymPopup();
            closeAboutPopup();
            });

            document.getElementById('wdym-popup').addEventListener('click', function(event) {
            event.stopPropagation();
            });

            document.getElementById('about-popup').addEventListener('click', function(event) {
            event.stopPropagation();
            });


            // Reset game

            function resetSite() {
            if (data.length === 0) {
                return;
            }

            index.left = 0;
            index.right = 0;

            renderCard('left');
            renderCard('right');
            closeWdymPopup();
            }

            document.getElementById('reset-button').addEventListener('click', function(event) {
            event.preventDefault();
            resetSite();           
            });


            loadSheet();

                //console.log(`${side} : ${index[side]}`)
                //let img = data[index[side]%data.length][side] // grab row by left/right index, get the left/right img
                
                //img = `https://www.placekittens.com/200/${300 + index[side]}`
                //let elm = document.getElementById(`card-${side}`)

                // const img = data[index[side] % data.length][side];
                // elm.style.backgroundImage = `url(${img}), linear-gradient(180deg, ${color}, white)`;
            
