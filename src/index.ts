import Fastify, { FastifyRequest } from "fastify";
import FastifyCors from "fastify-cors";

import { generatorFactory } from "./utils";

type TLookupObject = {
  peerId: string;
  peerIp: string;
};

const LOOKUP = new Map<string, TLookupObject>();
LOOKUP.set("ABCD", { peerId: "test", peerIp: "no.ip" });

const fastify = Fastify({ trustProxy: true });

fastify.register(FastifyCors, {
  origin: ["http://localhost:3000", "https://weave.e8y.fun"],
});

const generator = generatorFactory();

type PeerManagerPostRequest = FastifyRequest<{
  Body: {
    peerId: string;
  };
}>;
fastify.post("/", async (req: PeerManagerPostRequest, res) => {
  console.log(req.ip);
  const { peerId } = req.body;
  if (!peerId) return res.status(400).send();

  let uniqueCodeFound = false;
  let code;
  while (uniqueCodeFound === false) {
    const newCode = generator.generate();
    console.log(newCode);
    if (!LOOKUP.has(newCode)) {
      uniqueCodeFound = true;
      code = newCode;
      LOOKUP.set(newCode, { peerId, peerIp: req.ip });
    }
  }
  return res.status(200).send({ code });
});

type PeerManagerDeleteRequest = FastifyRequest<{
  Body: {
    peerId: string;
    code: string;
  };
}>;
fastify.delete("/", async (req: PeerManagerDeleteRequest, res) => {
  const { peerId, code } = req.body;
  if (!peerId || !code) return res.status(404).send(); // idc

  const weaveSession = LOOKUP.get(code);
  if (!weaveSession) return res.status(404).send(); // idc again

  if (weaveSession.peerId !== peerId) return res.status(404).send(); // still don't care

  LOOKUP.delete(code);
  res.status(200).send();
});

type PeerManagerGetRequest = FastifyRequest<{
  Querystring: {
    code: string;
  };
}>;
fastify.get("/", async (req: PeerManagerGetRequest, res) => {
  const { code } = req.query;
  if (!code) return res.status(404).send();

  const weaveSession = LOOKUP.get(code);
  if (!weaveSession) return res.status(404).send();

  return {
    peerId: weaveSession.peerId,
  };
});

const start = async () => {
  try {
    await fastify.listen(3600);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();
