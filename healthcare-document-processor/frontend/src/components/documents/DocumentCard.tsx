import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Button,
} from '@mui/material';
import {
  MoreVert,
  Download,
  Edit,
  Delete,
  Visibility,
  InsertDriveFile,
  Image as ImageIcon,
  PictureAsPdf,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { type Document, DocumentStatus } from '../../types/document.types';

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onDownload: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: DocumentStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case DocumentStatus.PROCESSED:
        return 'success';
      case DocumentStatus.PROCESSING:
        return 'info';
      case DocumentStatus.FAILED:
        return 'error';
      case DocumentStatus.ARCHIVED:
        return 'default';
      default:
        return 'warning';
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.includes('pdf')) return <PictureAsPdf />;
    if (mimeType?.startsWith('image/')) return <ImageIcon />;
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.light',
              width: 48,
              height: 48,
            }}
          >
            {getFileIcon(document.mime_type)}
          </Avatar>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} noWrap>
          {document.filename}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={document.document_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            label={document.status}
            size="small"
            color={getStatusColor(document.status)}
          />
        </Box>

        {document.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
            {document.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
          {document.tags?.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
            />
          ))}
          {document.tags && document.tags.length > 3 && (
            <Chip
              label={`+${document.tags.length - 3}`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {format(new Date(document.created_at), 'MMM dd, yyyy')} • {formatFileSize(document.file_size)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => onView(document)}
        >
          View
        </Button>
        <Button
          size="small"
          startIcon={<Download />}
          onClick={() => onDownload(document)}
        >
          Download
        </Button>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onView(document); handleMenuClose(); }}>
          <Visibility sx={{ mr: 2, fontSize: 20 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => { onEdit(document); handleMenuClose(); }}>
          <Edit sx={{ mr: 2, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { onDownload(document); handleMenuClose(); }}>
          <Download sx={{ mr: 2, fontSize: 20 }} />
          Download
        </MenuItem>
        <MenuItem
          onClick={() => { onDelete(document); handleMenuClose(); }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 2, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default DocumentCard;
