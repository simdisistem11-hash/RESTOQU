import { MediaUploadResult } from '@restoqu/types';

export interface MediaUploadOptions {
  tenantSlug: string;
  folderName: 'Branding' | 'Products' | 'Receipts' | 'Other';
  fileName: string;
  mimeType: string;
  base64Data: string;
}

export class MediaService {
  private gasEndpoint?: string;

  constructor(gasEndpoint?: string) {
    this.gasEndpoint = gasEndpoint || process.env.GOOGLE_APPS_SCRIPT_URL;
  }

  /**
   * Uploads file metadata and binary content to Google Drive via Google Apps Script.
   * If GAS endpoint is not set, returns a fallback demo storage URL.
   */
  async uploadFile(options: MediaUploadOptions): Promise<MediaUploadResult> {
    const { tenantSlug, folderName, fileName, mimeType, base64Data } = options;

    if (!this.gasEndpoint) {
      console.warn('[MediaService] GOOGLE_APPS_SCRIPT_URL missing. Using mock response.');
      return {
        fileId: `mock_drive_${Date.now()}`,
        driveUrl: `https://drive.google.com/uc?export=view&id=mock_${Date.now()}`,
        fileName,
        mimeType,
        size: Math.round(base64Data.length * 0.75)
      };
    }

    try {
      const response = await fetch(this.gasEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPLOAD',
          rootFolder: 'Restaurant SaaS',
          tenantFolder: `Tenant_${tenantSlug}`,
          subFolder: folderName,
          fileName,
          mimeType,
          fileData: base64Data
        })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image to Google Drive via GAS');
      }

      return {
        fileId: result.fileId,
        driveUrl: result.directUrl || result.driveUrl,
        fileName,
        mimeType,
        size: result.size || 0
      };
    } catch (err) {
      console.error('[MediaService Upload Error]:', err);
      throw err;
    }
  }
}
