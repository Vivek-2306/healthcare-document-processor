import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Stack,
  Button,
  Tooltip,
  InputAdornment,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Search,
  Clear,
  ContentCopy,
  Print,
  Highlight,
  Download,
} from '@mui/icons-material';
import type { DocumentTextResponse } from '../../types/processing.types';

interface DocumentTextViewerProps {
  textData: DocumentTextResponse;
  onCopy?: (text: string) => void;
  showConfidenceScore?: boolean;
}

const DocumentTextViewer: React.FC<DocumentTextViewerProps> = ({
  textData,
  onCopy,
  showConfidenceScore = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedText, setHighlightedText] = useState<string>('');

  const highlightedContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return textData.text;
    }

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = textData.text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '2px 0' }}>
            {part}
          </mark>
        );
      }
      return part;
    });
  }, [textData.text, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(textData.text);
    if (onCopy) {
      onCopy(textData.text);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document Text - ${textData.document_id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
          </head>
          <body>
            <h1>Document Text</h1>
            <pre>${textData.text}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([textData.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${textData.document_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const matchCount = searchQuery
    ? (textData.text.match(new RegExp(searchQuery, 'gi')) || []).length
    : 0;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h6">Extracted Text</Typography>
            <Stack direction="row" spacing={1}>
              {showConfidenceScore && textData.confidence_score !== undefined && (
                <Chip
                  label={`Confidence: ${(textData.confidence_score * 100).toFixed(1)}%`}
                  size="small"
                  color={
                    textData.confidence_score > 0.8
                      ? 'success'
                      : textData.confidence_score > 0.6
                        ? 'warning'
                        : 'error'
                  }
                />
              )}
              {textData.page_count && (
                <Chip
                  label={`${textData.page_count} page${textData.page_count > 1 ? 's' : ''}`}
                  size="small"
                />
              )}
            </Stack>
          </Box>

          <TextField
            fullWidth
            placeholder="Search in text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    edge="end"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {searchQuery && (
            <Typography variant="body2" color="text.secondary">
              Found {matchCount} match{matchCount !== 1 ? 'es' : ''}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Tooltip title="Copy text">
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopy />}
                onClick={handleCopy}
              >
                Copy
              </Button>
            </Tooltip>
            <Tooltip title="Print text">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Print />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Tooltip>
            <Tooltip title="Download as text file">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download />}
                onClick={handleDownload}
              >
                Download
              </Button>
            </Tooltip>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              minHeight: 400,
              maxHeight: 600,
              overflow: 'auto',
              backgroundColor: 'background.default',
            }}
          >
            <Typography
              component="div"
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              {highlightedContent}
            </Typography>
          </Paper>

          {textData.extracted_at && (
            <Typography variant="caption" color="text.secondary">
              Extracted at: {new Date(textData.extracted_at).toLocaleString()}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DocumentTextViewer;
