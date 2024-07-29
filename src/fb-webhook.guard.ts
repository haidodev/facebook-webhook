import { CanActivate, Injectable } from "@nestjs/common";

@Injectable()
export class FacebookWebhookGuard implements CanActivate {
    canActivate(context: any): boolean {
        const signature = context.switchToHttp().getRequest().headers['x-hub-signature-256'];
        return true;
    }
}