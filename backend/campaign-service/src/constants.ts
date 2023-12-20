export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

export enum ErrorTypes {
  INVALID_MONGO_ID_FORMAT = '400001',
  INVALID_DTO_FORMAT = '400002',
  SCHEMA_VALIDATION_ERROR = '400003',
  INVALID_CREDENTIALS = '401001',
  NO_ACCESS_RIGHTS_TO_RESOURCE = '403001',
  DOCUMENT_NOT_FOUND = '404001',
  DUPLICATED_KEY_INDEX_ERROR = '409001',
}

export enum StatusMessages {
  OK = 'ok',
}