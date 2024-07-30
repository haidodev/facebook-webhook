import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
}
