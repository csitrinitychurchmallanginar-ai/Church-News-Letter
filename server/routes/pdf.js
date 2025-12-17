var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from 'express';
import puppeteer from 'puppeteer';
var router = express.Router();
router.post('/generate-pdf', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, _a, church, scheduleData, htmlContent, page, pdf, monthNames, monthName, placeName, filename, error_1, closeError_1, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 12]);
                _a = req.body, church = _a.church, scheduleData = _a.scheduleData;
                if (!church || !scheduleData) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing church or schedule data' })];
                }
                if (!scheduleData.entries || scheduleData.entries.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'No schedule entries to generate PDF' })];
                }
                htmlContent = generateHTML(church, scheduleData);
                return [4 /*yield*/, puppeteer.launch({
                        headless: 'new',
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-dev-shm-usage',
                            '--disable-accelerated-2d-canvas',
                            '--no-first-run',
                            '--no-zygote',
                            '--disable-gpu',
                        ],
                        timeout: 30000,
                    })];
            case 1:
                // Launch Puppeteer with timeout
                // Use the new Headless mode to avoid deprecation warnings
                browser = _b.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _b.sent();
                // Set content with timeout
                return [4 /*yield*/, page.setContent(htmlContent, {
                        waitUntil: 'domcontentloaded',
                        timeout: 30000,
                    })];
            case 3:
                // Set content with timeout
                _b.sent();
                // Wait for fonts to load
                return [4 /*yield*/, page.evaluateHandle(function () { return document.fonts.ready; })];
            case 4:
                // Wait for fonts to load
                _b.sent();
                return [4 /*yield*/, page.pdf({
                        format: 'A4',
                        printBackground: true,
                        margin: {
                            top: '20mm',
                            right: '15mm',
                            bottom: '20mm',
                            left: '15mm',
                        },
                        timeout: 30000,
                    })];
            case 5:
                pdf = _b.sent();
                return [4 /*yield*/, browser.close()];
            case 6:
                _b.sent();
                browser = null;
                monthNames = [
                    'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
                    'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
                ];
                monthName = monthNames[scheduleData.month - 1] || "Month".concat(scheduleData.month);
                placeName = church.location || 'Place';
                filename = "".concat(placeName, "_").concat(monthName, "_").concat(scheduleData.year, ".pdf").replace(/[^a-zA-Z0-9._\u0B80-\u0BFF-]/g, '_');
                // Send PDF as response
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', "attachment; filename=\"".concat(encodeURIComponent(filename), "\""));
                res.send(pdf);
                return [3 /*break*/, 12];
            case 7:
                error_1 = _b.sent();
                console.error('Error generating PDF:', error_1);
                if (!browser) return [3 /*break*/, 11];
                _b.label = 8;
            case 8:
                _b.trys.push([8, 10, , 11]);
                return [4 /*yield*/, browser.close()];
            case 9:
                _b.sent();
                return [3 /*break*/, 11];
            case 10:
                closeError_1 = _b.sent();
                console.error('Error closing browser:', closeError_1);
                return [3 /*break*/, 11];
            case 11:
                errorMessage = (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Failed to generate PDF';
                res.status(500).json({
                    error: 'Failed to generate PDF',
                    details: errorMessage,
                });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
function generateHTML(church, scheduleData) {
    // Group entries by date
    var groupedByDate = new Map();
    scheduleData.entries.forEach(function (entry) {
        if (!groupedByDate.has(entry.date)) {
            groupedByDate.set(entry.date, []);
        }
        groupedByDate.get(entry.date).push(entry);
    });
    var dateKeys = Array.from(groupedByDate.keys());
    var tableRows = '';
    dateKeys.forEach(function (date) {
        var entries = groupedByDate.get(date);
        var rowSpan = entries.length;
        entries.forEach(function (entry, index) {
            var escapedDate = escapeHtml(entry.date);
            var escapedDay = escapeHtml(entry.day);
            var escapedTime = escapeHtml(entry.time || '');
            var escapedServiceType = escapeHtml(entry.serviceType || '');
            var escapedSpeaker = escapeHtml(entry.speaker || '');
            if (index === 0) {
                // First row: include date cell with rowspan
                tableRows += "\n    <tr>\n      <td rowspan=\"".concat(rowSpan, "\" style=\"border: 1px solid #000; padding: 8px; vertical-align: top;\">").concat(escapedDate, " (").concat(escapedDay, ")</td>\n      <td style=\"border: 1px solid #000; padding: 8px;\">").concat(escapedTime, "</td>\n      <td colspan=\"2\" style=\"border: 1px solid #000; padding: 8px;\">\n        <div style=\"margin-bottom: 4px;\">").concat(escapedServiceType, "</div>\n        <div>").concat(escapedSpeaker, "</div>\n      </td>\n    </tr>");
            }
            else {
                // Subsequent rows: no date cell
                tableRows += "\n    <tr>\n      <td style=\"border: 1px solid #000; padding: 8px;\">".concat(escapedTime, "</td>\n      <td colspan=\"2\" style=\"border: 1px solid #000; padding: 8px;\">\n        <div style=\"margin-bottom: 4px;\">").concat(escapedServiceType, "</div>\n        <div>").concat(escapedSpeaker, "</div>\n      </td>\n    </tr>");
            }
        });
    });
    var escapedChurchName = escapeHtml(church.name);
    var escapedLocation = escapeHtml(church.location);
    return "\n<!DOCTYPE html>\n<html lang=\"ta\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>".concat(escapedChurchName, "</title>\n  <style>\n    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap');\n    \n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n    \n    body {\n      font-family: 'Noto Sans Tamil', Arial, sans-serif;\n      padding: 20px;\n      background: white;\n    }\n    \n    .header {\n      background-color: #000;\n      color: #fff;\n      padding: 15px;\n      text-align: center;\n      font-weight: bold;\n      font-size: 18px;\n      margin-bottom: 0;\n    }\n    \n    table {\n      width: 100%;\n      border-collapse: collapse;\n      border: 2px solid #000;\n      margin-top: 0;\n    }\n    \n    th {\n      border: 1px solid #000;\n      padding: 12px;\n      background-color: #f0f0f0;\n      font-weight: bold;\n      text-align: left;\n      font-size: 14px;\n    }\n    \n    td {\n      border: 1px solid #000;\n      padding: 8px;\n      font-size: 14px;\n    }\n    \n    tr:nth-child(even) {\n      background-color: #fafafa;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"header\">").concat(escapedChurchName, ", ").concat(escapedLocation, "</div>\n  <table>\n    <thead>\n      <tr>\n        <th>\u0BA4\u0BC7\u0BA4\u0BBF / \u0BA8\u0BBE\u0BB3\u0BCD</th>\n        <th>\u0BA8\u0BC7\u0BB0\u0BAE\u0BCD</th>\n        <th colspan=\"2\">\u0B86\u0BB0\u0BBE\u0BA4\u0BA9\u0BC8 / \u0BA8\u0BBF\u0B95\u0BB4\u0BCD\u0BB5\u0BC1 \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BAA\u0BC7\u0B9A\u0BCD\u0B9A\u0BBE\u0BB3\u0BB0\u0BCD / \u0BA4\u0BB2\u0BC8\u0BB5\u0BB0\u0BCD</th>\n      </tr>\n    </thead>\n    <tbody>\n      ").concat(tableRows, "\n    </tbody>\n  </table>\n</body>\n</html>\n  ");
}
export default router;
