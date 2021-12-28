import Fastify, { FastifyRequest } from "fastify";

import { generatorFactory } from "./utils";

type TLookupObject = {
  peerId: string;
};

const LOOKUP = new Map<string, TLookupObject>();

const fastify = Fastify();

const generator = generatorFactory();

type PeerManagerPostRequest = FastifyRequest<{
  Body: {
    peerId: string;
  };
}>;
fastify.post("/peermanager", async (req: PeerManagerPostRequest, res) => {
  res.statusCode = 400;

  const { peerId } = req.body;
  if (!peerId) return;

  let uniqueCodeFound = false;
  while (uniqueCodeFound === false) {
    const newCode = generator.generate();
    if (!LOOKUP.has(newCode)) {
      uniqueCodeFound = false;
      LOOKUP.set(newCode, { peerId });
    }
  }
  res.statusCode = 200;
});

type PeerManagerDeleteRequest = FastifyRequest<{
  Body: {
    peerId: string;
    code: string;
  };
}>;
fastify.delete("/peermanager", async (req: PeerManagerDeleteRequest, res) => {
  res.statusCode = 404; // hehe

  const { peerId, code } = req.body;
  if (!peerId || !code) return; // idc

  const weaveSession = LOOKUP.get(code);
  if (!weaveSession) return; // idc again

  if (weaveSession.peerId !== peerId) return; // still don't care

  LOOKUP.delete(code);
  res.statusCode = 200;
});

type PeerManagerGetRequest = FastifyRequest<{
  Body: {
    code: string;
  };
}>;
fastify.get("/peermanager", async (req: PeerManagerGetRequest, res) => {
  res.statusCode = 400;

  const { code = "20" } = req.body;
  if (!code) return;

  const weaveSession = LOOKUP.get(code);
  if (!weaveSession) return;

  res.statusCode = 200;
  return {
    peerId: weaveSession.peerId,
  };
});

const start = async () => {
  try {
    await fastify.listen(3001);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();
