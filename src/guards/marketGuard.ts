import { BadRequestException, CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
class MarketGuard implements CanActivate {
    constructor(private jwt: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new HttpException('token not found please relogin', 402);

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        try {
            const decoded = await this.jwt.verifyAsync(token);
            if (decoded.role !== 'market') throw new BadRequestException('this route is not for you');
            req.market = decoded;
            return true;
        } catch (error) {
            throw new HttpException('token expired please relogin', 403);
        }
    }
}

export default MarketGuard;
