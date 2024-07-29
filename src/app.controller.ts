import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { AppService } from "./app.service";
import { Request } from "express";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get('/webhook')
    verifyWebhook(@Req() res: Request): string {
        return this.appService.verifyWebhook(res.query);
    }
    @Post('/webhook')
    receiveMessage(@Body() body: any): void {
        this.appService.receiveMessage(body);
    }
}