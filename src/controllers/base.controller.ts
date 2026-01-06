import { ApiAppErrors } from '@/decorators/api-errors.decorator';

@ApiAppErrors()
export abstract class BaseController {}
