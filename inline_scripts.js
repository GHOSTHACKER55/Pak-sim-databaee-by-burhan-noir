
        // MATRIX RAIN EFFECT
        const canvas = document.getElementById('matrix-bg');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(10,10,10,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px monospace`;
            
            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, y * fontSize);
                
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
        }
        
        setInterval(drawMatrix, 50);

        // RESIZE HANDLER
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // ORIGINAL JAVASCRIPT (unchanged functionality)
        const API_BASE_URL = 'https://sim-data.ftgmhacks.workers.dev/'; 
        const phoneNumberInput = document.getElementById('phone-number');
        const searchButton = document.getElementById('search-button');
        const resultsDiv = document.getElementById('results');
        const copyButton = document.getElementById('copy-button');

        function displayError(message) {
            resultsDiv.innerHTML = `<span class="error-message">🔥 SYSTEM ERROR 🔥</span>\n\n${message}\n\nTARGET NOT FOUND.`;
            copyButton.style.display = 'none';
        }

        async function searchDatabase() {
            const number = phoneNumberInput.value.trim();
            
            if (!number) {
                displayError("TARGET REQUIRED");
                return;
            }

            resultsDiv.innerHTML = `<div class="loading">DECRYPTING TARGET DATA...</div>`;
            copyButton.style.display = 'none';
            searchButton.disabled = true;
            searchButton.innerText = 'HACKING...';

            try {
                const url = `${API_BASE_URL}?number=${encodeURIComponent(number)}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                
                let records = [];
                if (Array.isArray(data)) {
                    records = data;
                } else if (data && Array.isArray(data.detail)) {
                    records = data.detail;
                } else if (data && Array.isArray(data.records)) {
                    records = data.records;
                } else if (data && Array.isArray(data.data)) {
                    records = data.data;
                }
                
                if (records.length > 0) {
                    const resultText = records.map(record => {
                        return `╔══════════════════════════════════════╗
║ TARGET ACQUIRED: ${record.name || record.owner || 'UNKNOWN'} ║
║ PHONE: ${record.mobile || record.number || 'N/A'}             ║
║ CNIC:  ${record.cNIC || record.cnic || record.idcard || 'N/A'}║
║ LOCATION: ${record.address || record.location || 'N/A'}      ║
╚══════════════════════════════════════╝`.trim();
                    }).join('\n\n');

                    resultsDiv.innerText = resultText;
                    copyButton.style.display = 'block';
                } else {
                    displayError(`TARGET ${number} - NO DATA FOUND`);
                }

            } catch (error) {
                console.error('ERROR:', error);
                displayError('CONNECTION LOST - FIREWALL DETECTED');
            } finally {
                searchButton.disabled = false;
                searchButton.innerText = 'EXECUTE HACK';
            }
        }

        function copyResults() {
            const textToCopy = resultsDiv.innerText;
            if (!textToCopy || textToCopy.includes('ERROR') || textToCopy.includes('TARGET REQUIRED')) {
                 alert("⚠️ NO DATA TO EXTRACT");
                 return;
            }

            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('✅ DATA EXTRACTED');
                }).catch(err => {
                    fallbackCopyText(textToCopy);
                });
            } else {
                fallbackCopyText(textToCopy);
            }
        }

        function fallbackCopyText(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert('✅ DATA EXTRACTED (BACKDOOR)');
            } catch (err) {
                alert('❌ EXTRACTION FAILED');
            }
            document.body.removeChild(textArea);
        }

        searchButton.addEventListener('click', searchDatabase);
        copyButton.addEventListener('click', copyResults);
        phoneNumberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchDatabase();
            }
        });
    