
#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { URL } = require('url');
const { performance } = require('perf_hooks');

// ANSI Colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m'
};

class LoadTester {
    constructor(url, vus, duration, requestsPerVu = 100) {
        this.url = url;
        this.vus = vus;
        this.duration = duration * 1000; // Convert to milliseconds
        this.requestsPerVu = requestsPerVu;
        this.totalRequests = 0;
        this.successfulRequests = 0;
        this.failedRequests = 0;
        this.responseTimes = [];
        this.startTime = 0;
        this.endTime = 0;
        this.isRunning = false;
        
        // Parse URL
        this.parsedUrl = new URL(url);
        this.isHttps = this.parsedUrl.protocol === 'https:';
        this.httpModule = this.isHttps ? https : http;
    }

    printHeader() {
        console.clear();
        console.log(colors.cyan + colors.bright + '╔══════════════════════════════════════════════════════════════╗');
        console.log('║                    🚀 LOAD TESTER CLI 🚀                     ║');
        console.log('╚══════════════════════════════════════════════════════════════╝' + colors.reset);
        console.log();
        console.log(colors.white + colors.bright + 'Configuration:' + colors.reset);
        console.log(`  ${colors.blue}Target URL:${colors.reset}     ${this.url}`);
        console.log(`  ${colors.blue}Virtual Users:${colors.reset}  ${colors.yellow}${this.vus.toLocaleString()}${colors.reset}`);
        console.log(`  ${colors.blue}Duration:${colors.reset}       ${colors.yellow}${this.duration / 1000}s${colors.reset}`);
        console.log(`  ${colors.blue}Requests/VU:${colors.reset}    ${colors.yellow}${this.requestsPerVu}${colors.reset}`);
        console.log(`  ${colors.blue}Total Requests:${colors.reset} ${colors.yellow}${(this.vus * this.requestsPerVu).toLocaleString()}${colors.reset}`);
        console.log();
    }

    showLoadingAnimation() {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        
        return setInterval(() => {
            if (!this.isRunning) return;
            
            const elapsed = Math.min(Date.now() - this.startTime, this.duration);
            const progress = (elapsed / this.duration) * 100;
            const progressBar = this.createProgressBar(progress);
            
            process.stdout.write('\r' + colors.cyan + frames[i] + colors.reset + 
                ` ${colors.bright}Testing in progress...${colors.reset} ${progressBar} ` +
                colors.yellow + `${progress.toFixed(1)}%${colors.reset}`);
            
            i = (i + 1) % frames.length;
        }, 100);
    }

    createProgressBar(percentage) {
        const width = 30;
        const filled = Math.round((percentage / 100) * width);
        const empty = width - filled;
        
        return colors.green + '█'.repeat(filled) + colors.gray + '░'.repeat(empty) + colors.reset;
    }

    async makeRequest() {
        return new Promise((resolve) => {
            const startTime = performance.now();
            
            const options = {
                hostname: this.parsedUrl.hostname,
                port: this.parsedUrl.port || (this.isHttps ? 443 : 80),
                path: this.parsedUrl.pathname + this.parsedUrl.search,
                method: 'GET',
                timeout: 10000,
                headers: {
                    'User-Agent': 'LoadTester-CLI/1.0'
                }
            };

            const req = this.httpModule.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    const endTime = performance.now();
                    const responseTime = endTime - startTime;
                    
                    this.totalRequests++;
                    this.responseTimes.push(responseTime);
                    
                    if (res.statusCode >= 200 && res.statusCode < 400) {
                        this.successfulRequests++;
                    } else {
                        this.failedRequests++;
                    }
                    
                    resolve();
                });
            });

            req.on('error', () => {
                this.totalRequests++;
                this.failedRequests++;
                resolve();
            });

            req.on('timeout', () => {
                req.destroy();
                this.totalRequests++;
                this.failedRequests++;
                resolve();
            });

            req.end();
        });
    }

    async runVirtualUser() {
        const requests = [];
        const requestsToMake = Math.min(this.requestsPerVu, 
            Math.ceil(this.duration / 50)); // Prevent too many requests
        
        for (let i = 0; i < requestsToMake && this.isRunning; i++) {
            requests.push(this.makeRequest());
            
            // Add small delay between requests to prevent overwhelming
            if (i < requestsToMake - 1) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        await Promise.all(requests);
    }

    calculateStats() {
        if (this.responseTimes.length === 0) return null;
        
        const sorted = this.responseTimes.sort((a, b) => a - b);
        const avg = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const p50 = sorted[Math.floor(sorted.length * 0.5)];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const p99 = sorted[Math.floor(sorted.length * 0.99)];
        
        return { avg, min, max, p50, p95, p99 };
    }

    printResults() {
        console.log('\n\n' + colors.cyan + colors.bright + '╔══════════════════════════════════════════════════════════════╗');
        console.log('║                      📊 TEST RESULTS 📊                      ║');
        console.log('╚══════════════════════════════════════════════════════════════╝' + colors.reset);
        console.log();
        
        const duration = (this.endTime - this.startTime) / 1000;
        const rps = (this.totalRequests / duration).toFixed(2);
        const successRate = ((this.successfulRequests / this.totalRequests) * 100).toFixed(2);
        
        console.log(colors.white + colors.bright + 'Summary:' + colors.reset);
        console.log(`  ${colors.blue}Total Requests:${colors.reset}     ${colors.yellow}${this.totalRequests.toLocaleString()}${colors.reset}`);
        console.log(`  ${colors.blue}Successful:${colors.reset}         ${colors.green}${this.successfulRequests.toLocaleString()}${colors.reset}`);
        console.log(`  ${colors.blue}Failed:${colors.reset}             ${colors.red}${this.failedRequests.toLocaleString()}${colors.reset}`);
        console.log(`  ${colors.blue}Success Rate:${colors.reset}       ${colors.green}${successRate}%${colors.reset}`);
        console.log(`  ${colors.blue}Duration:${colors.reset}           ${colors.yellow}${duration.toFixed(2)}s${colors.reset}`);
        console.log(`  ${colors.blue}Requests/sec:${colors.reset}       ${colors.yellow}${rps}${colors.reset}`);
        console.log();
        
        const stats = this.calculateStats();
        if (stats) {
            console.log(colors.white + colors.bright + 'Response Times (ms):' + colors.reset);
            console.log(`  ${colors.blue}Average:${colors.reset}            ${colors.yellow}${stats.avg.toFixed(2)}${colors.reset}`);
            console.log(`  ${colors.blue}Min:${colors.reset}                ${colors.green}${stats.min.toFixed(2)}${colors.reset}`);
            console.log(`  ${colors.blue}Max:${colors.reset}                ${colors.red}${stats.max.toFixed(2)}${colors.reset}`);
            console.log(`  ${colors.blue}50th percentile:${colors.reset}    ${colors.yellow}${stats.p50.toFixed(2)}${colors.reset}`);
            console.log(`  ${colors.blue}95th percentile:${colors.reset}    ${colors.yellow}${stats.p95.toFixed(2)}${colors.reset}`);
            console.log(`  ${colors.blue}99th percentile:${colors.reset}    ${colors.yellow}${stats.p99.toFixed(2)}${colors.reset}`);
        }
        
        console.log();
        console.log(colors.cyan + '✅ Load test completed successfully!' + colors.reset);
    }

    async run() {
        this.printHeader();
        
        console.log(colors.yellow + '⚡ Preparing to launch virtual users...' + colors.reset);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(colors.green + '🚀 Starting load test...' + colors.reset);
        console.log();
        
        this.isRunning = true;
        this.startTime = Date.now();
        
        const loadingInterval = this.showLoadingAnimation();
        
        // Create virtual users
        const virtualUsers = [];
        for (let i = 0; i < this.vus; i++) {
            virtualUsers.push(this.runVirtualUser());
        }
        
        // Set timeout to stop after duration
        const timeout = setTimeout(() => {
            this.isRunning = false;
        }, this.duration);
        
        // Wait for all VUs to complete or timeout
        await Promise.race([
            Promise.all(virtualUsers),
            new Promise(resolve => setTimeout(resolve, this.duration + 1000))
        ]);
        
        this.isRunning = false;
        this.endTime = Date.now();
        
        clearInterval(loadingInterval);
        clearTimeout(timeout);
        
        process.stdout.write('\r' + ' '.repeat(80) + '\r'); // Clear loading line
        
        this.printResults();
    }
}

// CLI Interface
function printUsage() {
    console.log(colors.cyan + colors.bright + '🚀 Load Tester CLI v1.0.0' + colors.reset);
    console.log();
    console.log(colors.white + 'Usage:' + colors.reset);
    console.log('  load-tester --url <URL> --vus <NUMBER> --duration <SECONDS> [OPTIONS]');
    console.log();
    console.log(colors.white + 'Required Parameters:' + colors.reset);
    console.log(`  ${colors.blue}--url${colors.reset}            Target URL to test (must include http:// or https://)`);
    console.log(`  ${colors.blue}--vus${colors.reset}            Number of Virtual Users (1-10000)`);
    console.log(`  ${colors.blue}--duration${colors.reset}       Test duration in seconds`);
    console.log();
    console.log(colors.white + 'Optional Parameters:' + colors.reset);
    console.log(`  ${colors.blue}--requests${colors.reset}       Requests per Virtual User (default: 100)`);
    console.log(`  ${colors.blue}--help${colors.reset}           Show this help message`);
    console.log(`  ${colors.blue}--version${colors.reset}        Show version information`);
    console.log();
    console.log(colors.white + 'Examples:' + colors.reset);
    console.log(`  ${colors.gray}load-tester --url https://example.com --vus 1000 --duration 60${colors.reset}`);
    console.log(`  ${colors.gray}load-tester --url https://api.example.com --vus 500 --duration 30 --requests 50${colors.reset}`);
    console.log(`  ${colors.gray}load-tester --url http://localhost:3000 --vus 100 --duration 10${colors.reset}`);
    console.log();
    console.log(colors.white + 'Note:' + colors.reset + ' Each VU will send the specified number of requests during the test duration.');
}

function parseArguments(args) {
    const params = {};
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--url':
                params.url = args[++i];
                break;
            case '--vus':
                params.vus = parseInt(args[++i]);
                break;
            case '--duration':
                params.duration = parseInt(args[++i]);
                break;
            case '--requests':
                params.requests = parseInt(args[++i]);
                break;
            case '--help':
            case '-h':
                params.help = true;
                break;
            case '--version':
            case '-v':
                params.version = true;
                break;
            default:
                if (arg.startsWith('--')) {
                    console.error(colors.red + `❌ Unknown parameter: ${arg}${colors.reset}`);
                    process.exit(1);
                }
        }
    }
    
    return params;
}

async function main() {
    const args = process.argv.slice(2);
    const params = parseArguments(args);
    
    if (params.help) {
        printUsage();
        process.exit(0);
    }
    
    if (params.version) {
        console.log(colors.cyan + 'Load Tester CLI v1.0.0' + colors.reset);
        process.exit(0);
    }
    
    if (!params.url || !params.vus || !params.duration) {
        console.error(colors.red + '❌ Error: Missing required parameters' + colors.reset);
        console.log();
        printUsage();
        process.exit(1);
    }
    
    // Validate arguments
    if (!params.url.startsWith('http://') && !params.url.startsWith('https://')) {
        console.error(colors.red + '❌ Error: URL must start with http:// or https://' + colors.reset);
        process.exit(1);
    }
    
    if (isNaN(params.vus) || params.vus <= 0) {
        console.error(colors.red + ' Error: VUs must be a positive number' + colors.reset);
        process.exit(1);
    }
    
    if (isNaN(params.duration) || params.duration <= 0) {
        console.error(colors.red + ' Error: Duration must be a positive number' + colors.reset);
        process.exit(1);
    }
    
    const requests = params.requests || 100;
    if (isNaN(requests) || requests <= 0) {
        console.error(colors.red + ' Error: Requests per VU must be a positive number' + colors.reset);
        process.exit(1);
    }
    
    // Safety limits
    if (params.vus > 10000) {
        console.error(colors.red + ' Error: Maximum 10,000 VUs allowed for safety' + colors.reset);
        process.exit(1);
    }
    
    const totalRequests = params.vus * requests;
    if (totalRequests > 1000000) {
        console.error(colors.red + ' Error: Total requests would exceed 1,000,000. Please reduce VUs or requests per VU.' + colors.reset);
        process.exit(1);
    }
    
    const tester = new LoadTester(params.url, params.vus, params.duration, requests);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n' + colors.yellow + '  Test interrupted by user' + colors.reset);
        tester.isRunning = false;
        setTimeout(() => {
            tester.printResults();
            process.exit(0);
        }, 1000);
    });
    
    try {
        await tester.run();
    } catch (error) {
        console.error(colors.red + ' Error running load test:' + colors.reset, error.message);
        process.exit(1);
    }
}

// Export for pkg building
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { LoadTester };
Made with
1
