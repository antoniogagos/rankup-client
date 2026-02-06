export type MediaVisibility = 'public' | 'unlisted' | 'private';
export type MediaKind = 'image';
export type UploadStatus = 'created' | 'uploaded' | 'completing' | 'processing' | 'completed' | 'failed' | 'expired' | 'aborted';
export type MediaStatus = 'processing' | 'ready' | 'rejected' | 'failed' | 'deleted';
export type ChecksumAlgorithm = 'sha256';
export type UploadDestinationStrategy = 'singlePut' | 'multipartFormPost';
export type MediaInclude = 'variants' | 'original';
export type MediaModerationStatus = 'notRequired' | 'pending' | 'approved' | 'rejected';
