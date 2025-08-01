# Load Tester CLI

Professional Load Testing CLI Tool with beautiful interface and comprehensive features for testing your website or API performance.

![Load Tester CLI Interface](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Load+Tester+CLI)

## 🚀 Key Features

- **Virtual Users (VUs)** - Simulate up to 10,000 concurrent users
- **Flexible Duration** - Set test duration according to your needs
- **Comprehensive Statistics** - Response time, success rate, RPS, and percentiles
- **Beautiful Interface** - Loading animations, progress bars, and colorful output
- **Real-time Progress** - Monitor testing progress live
- **Cross Platform** - Supports Windows, macOS, and Linux
- **Standalone Binary** - No Node.js installation required

## 📦 Installation

### Method 1: Download Binary (Recommended)

1. Download binary for your platform from [Releases](https://github.com/davanico1122/load-tester-cli/releases)
2. Extract and run directly

**Windows:**
```bash
load-tester-cli.exe --url https://example.com --vus 100 --duration 30
```

**macOS/Linux:**
```bash
./load-tester-cli --url https://example.com --vus 100 --duration 30
```

### Method 2: Build from Source

```bash
# Clone repository
git clone https://github.com/davanico1122/load-tester-cli.git
cd load-tester-cli

# Install dependencies
npm install

# Build for all platforms
npm run build-all

# Binaries will be available in dist/ folder
```

### Method 3: Run with Node.js

```bash
# Clone repository
git clone https://github.com/davanico1122/load-tester-cli.git
cd load-tester-cli

# Install dependencies
npm install

# Run directly
node load-tester.js --url https://example.com --vus 100 --duration 30
```

## 🎯 Usage

### Basic Syntax
```bash
load-tester --url <URL> --vus <VIRTUAL_USERS> --duration <SECONDS> [OPTIONS]
```

### Required Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--url` | Target URL to test (must include http:// or https://) | `--url https://example.com` |
| `--vus` | Number of Virtual Users (1-10000) | `--vus 1000` |
| `--duration` | Test duration in seconds | `--duration 60` |

### Optional Parameters

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `--requests` | Number of requests per Virtual User | 100 | `--requests 50` |
| `--help` | Show help message | - | `--help` |
| `--version` | Show version information | - | `--version` |

### Usage Examples

**Basic Load Test:**
```bash
load-tester --url https://jsonplaceholder.typicode.com/posts --vus 100 --duration 30
```

**High Load Test:**
```bash
load-tester --url https://api.example.com --vus 5000 --duration 120
```

**Custom Requests per VU:**
```bash
load-tester --url https://example.com --vus 500 --duration 60 --requests 200
```

**Local Development Test:**
```bash
load-tester --url http://localhost:3000/api/users --vus 50 --duration 15
```

**Quick Performance Check:**
```bash
load-tester --url https://example.com --vus 10 --duration 5 --requests 10
```

## 📊 Understanding Test Results

### Summary Section
```
Summary:
  Total Requests: 50,000
  Successful: 49,850
  Failed: 150
  Success Rate: 99.70%
  Duration: 60.45s
  Requests/sec: 827.15
```

### Response Times Section
```
Response Times (ms):
  Average: 120.45
  Min: 45.20
  Max: 2,450.80
  50th percentile: 98.65
  95th percentile: 245.30
  99th percentile: 890.45
```

### Interpreting Results

- **Success Rate**: Percentage of successful requests (200-399 status codes)
- **Requests/sec (RPS)**: Server throughput in handling requests
- **Average Response Time**: Mean time for server to respond
- **Percentiles**:
  - **P50**: 50% of requests completed in this time or less
  - **P95**: 95% of requests completed in this time or less
  - **P99**: 99% of requests completed in this time or less

## 🔧 Manual Build

### Prerequisites
- Node.js ≥ 14.0.0
- npm or yarn

### Build Steps

```bash
# Install dependencies
npm install

# Install pkg globally (if not already installed)
npm install -g pkg

# Build for specific platform
pkg . --targets=node18-win-x64 --out-path=dist    # Windows
pkg . --targets=node18-macos-x64 --out-path=dist  # macOS
pkg . --targets=node18-linux-x64 --out-path=dist  # Linux

# Build for all platforms
npm run build-all
```

### Available Build Targets

- `node18-win-x64` - Windows 64-bit
- `node18-macos-x64` - macOS 64-bit
- `node18-linux-x64` - Linux 64-bit
- `node18-macos-arm64` - macOS Apple Silicon (M1/M2)
- `node18-linux-arm64` - Linux ARM64

## ⚠️ Limitations and Safety

### System Limitations
- Maximum VUs: 10,000 (to prevent system overload)
- Maximum Total Requests: 1,000,000 per session
- Request Timeout: 10 seconds
- Inter-request Delay: 50ms (to prevent spam)

### Security and Ethics
- **DO NOT** use to attack other people's websites
- Use only for testing your own websites/APIs
- Ensure you have permission to perform load testing
- Start with small VUs and increase gradually

## 🛠️ Troubleshooting

### Error: "ECONNREFUSED"
```bash
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure URL is correct and server is running
- Check if firewall is blocking the connection

### Error: "Maximum call stack size exceeded"
```bash
Error: Maximum call stack size exceeded
```
**Solution:**
- Reduce number of VUs or requests per VU
- Ensure system has sufficient RAM

### Error: "EMFILE: too many open files"
```bash
Error: EMFILE: too many open files
```
**Solution:**
- Reduce number of VUs
- Increase system file descriptor limit:
```bash
# Linux/macOS
ulimit -n 65536
```

### Load Test Slow/Hanging
**Solution:**
- Check internet connection
- Reduce number of VUs
- Ensure target server can handle the load

## 📈 Optimization Tips

### 1. Determining Optimal VUs
```bash
# Start small
load-tester --url https://example.com --vus 10 --duration 10

# Increase gradually
load-tester --url https://example.com --vus 50 --duration 30
load-tester --url https://example.com --vus 100 --duration 60
```

### 2. Testing Strategy
- **Smoke Test**: 1-10 VUs, 1-5 minutes
- **Load Test**: 10-100 VUs, 5-15 minutes
- **Stress Test**: 100-1000 VUs, 15-30 minutes
- **Spike Test**: Dramatically increase/decrease VUs

### 3. Monitoring System Resources
- Monitor CPU, RAM, and Network on target server
- Use tools like `htop`, `netstat`, or monitoring tools

## 📋 Load Testing Best Practices

### Planning Your Tests
Define Objectives:
- What are you trying to measure?
- What's your expected baseline performance?
- What's your performance target?

### Environment Preparation
- Use dedicated test environment
- Ensure consistent network conditions
- Disable unnecessary services

### Test Scenarios
```bash
# Baseline test
load-tester --url https://api.example.com --vus 1 --duration 60

# Normal load
load-tester --url https://api.example.com --vus 50 --duration 300

# Peak load
load-tester --url https://api.example.com --vus 200 --duration 600

# Stress test
load-tester --url https://api.example.com --vus 1000 --duration 300
```

### Interpreting Performance Metrics

| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| Success Rate | >99.9% | >99% | <99% |
| Average Response Time | <100ms | <500ms | >1000ms |
| 95th Percentile | <200ms | <1000ms | >2000ms |
| RPS | Depends on requirements | - | - |

## 🚀 Performance Benchmarks

Tested on various systems:

| System | Max VUs | Max RPS | Notes |
|--------|---------|---------|-------|
| MacBook Pro M1 | 5,000 | 15,000 | Excellent performance |
| Ubuntu 20.04 (4 cores) | 3,000 | 10,000 | Good performance |
| Windows 10 (8GB RAM) | 2,000 | 8,000 | Stable performance |

*Results may vary based on target server and network conditions.*

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

### Development Setup
```bash
# Clone and setup
git clone https://github.com/davanico1122/load-tester-cli.git
cd load-tester-cli
npm install

# Run tests
npm test

# Run example
npm run example
```

### Code Style
- Use ESLint configuration
- Follow Node.js best practices
- Add tests for new features
- Update documentation

## 📝 Changelog

### v1.0.0 (Current)
- Initial release
- Virtual Users support
- Real-time statistics
- Beautiful CLI interface
- Cross-platform binary support
- High-performance HTTP client
- Safety limits and error handling

### Planned Features
- Support for POST/PUT/DELETE methods
- Authentication support
- CSV/JSON result export
- Customizable output formats
- Proxy support
- Configuration files

## 🔒 Security Considerations

### Responsible Testing
- Only test systems you own or have explicit permission to test
- Be aware of rate limiting and terms of service
- Monitor resource usage on both client and server
- Consider impact on other users/services

### Legal Compliance
- Ensure compliance with local laws and regulations
- Respect website terms of service
- Consider GDPR and data protection requirements
- Document your testing authorization

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

```
MIT License

Copyright (c) 2024 Load Tester CLI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

##  Acknowledgments

- Inspired by industry-standard tools like k6 and Apache Bench
- Built with Node.js built-in modules for optimal performance
- CLI interface inspired by modern development tools
- Community feedback and contributions

##  Support

If you encounter issues or have questions:

- [Report Bug](https://github.com/davanico1122/load-tester-cli/issues)
- [Request Feature](https://github.com/davanico1122/load-tester-cli/discussions)
- [Discussions](https://github.com/davanico1122/load-tester-cli/discussions)
- Email: support@loadtestercli.com

##  FAQ

**Q: Can I test HTTPS websites?**
A: Yes, the tool supports both HTTP and HTTPS protocols.

**Q: What's the difference between VUs and requests?**
A: VUs (Virtual Users) simulate concurrent users. Each VU sends multiple requests during the test duration.

**Q: Can I test APIs with authentication?**
A: Currently, the tool supports basic GET requests. For authenticated APIs, consider using a proxy or modifying the source code.

**Q: Is this tool suitable for production testing?**
A: Yes, but always test responsibly and ensure you have proper authorization.

---

**Happy Load Testing!** 

*Made with  for the developer community*
