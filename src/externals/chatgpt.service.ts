import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatMessage } from './types/chat-message.interface';
import { ChatCompletion } from 'openai/resources';

/**
 * @description ChatGPTとの接続処理を行うクラス
 */
@Injectable()
export class ChatGPTService {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = configService.get('OPENAI_API_KEY');
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    const openai = new OpenAI({ apiKey: this.apiKey });
    let response: ChatCompletion;
    try {
      response = await openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL'),
        messages,
      });
    } catch (e) {
      throw new BadRequestException('生成に失敗しました', e);
    }
    return response.choices[0].message.content;
  }
}
