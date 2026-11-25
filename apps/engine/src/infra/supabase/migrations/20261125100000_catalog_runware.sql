-- Moves the catalog onto Runware. Models carry the vendor that makes them, and
-- the placeholder seed gives way to Runware models keyed by AIR id. Name,
-- summary, order and selling price are ours; capabilities, upstream cost,
-- vendor and availability come from `npm run catalog:sync`, so each model
-- starts inactive until its first sync.
alter table public.generation_models
  add column if not exists vendor_id text,
  add column if not exists vendor_name text,
  add column if not exists vendor_logo_url text;

delete from public.generation_models where provider <> 'runware';

insert into public.generation_models (slug, name, summary, provider, provider_model_key, sort_order, active)
values
  ('seedance-2-0', 'Seedance 2.0', 'Multimodal video with native audio and long takes.', 'runware', 'bytedance:seedance@2.0', 10, false),
  ('veo-3-1-fast', 'Veo 3.1 Fast', 'Quick, polished video with native audio.', 'runware', 'google:3@3', 20, false),
  ('kling-3-0-pro', 'Kling 3.0 Pro', 'High-fidelity 1080p video with optional audio.', 'runware', 'klingai:kling-video@3-pro', 30, false),
  ('wan-2-6', 'Wan 2.6', 'Multi-shot video with native sound.', 'runware', 'alibaba:wan@2.6', 40, false),
  ('kling-2-5-turbo-pro', 'Kling 2.5 Turbo Pro', 'Cinematic drafts at a low price.', 'runware', 'klingai:6@1', 50, false),
  ('nano-banana-pro', 'Nano Banana Pro', 'Precise images and edits up to 4K.', 'runware', 'google:4@2', 60, false),
  ('nano-banana-2', 'Nano Banana 2', 'Fast everyday images from 0.5K to 4K.', 'runware', 'google:4@3', 70, false),
  ('seedream-4-0', 'Seedream 4.0', 'Affordable stills up to 4K.', 'runware', 'bytedance:5@0', 80, false),
  ('seedream-5-0-lite', 'Seedream 5.0 Lite', 'Quick stills for drafts and social posts.', 'runware', 'bytedance:seedream@5.0-lite', 90, false)
on conflict (provider, provider_model_key) do nothing;

-- Base price is the lowest Runware rate plus 50%; resolution and audio
-- multipliers follow Runware's own rate steps.
insert into public.model_prices (model_id, unit_price_micros, pricing_rules)
select models.id, prices.unit_price_micros, prices.pricing_rules::jsonb
from (
  values
    ('seedance-2-0', 111000, '{"resolution_multipliers": {"720p": 2.16, "1080p": 5.51, "4k": 11.14}}'),
    ('veo-3-1-fast', 150000, '{"resolution_multipliers": {"4K": 3}, "audio_multiplier": 1.5}'),
    ('kling-3-0-pro', 168000, '{"audio_multiplier": 1.5}'),
    ('wan-2-6', 150000, '{"resolution_multipliers": {"1080p": 1.5}}'),
    ('kling-2-5-turbo-pro', 105000, '{}'),
    ('nano-banana-pro', 207000, '{"resolution_multipliers": {"4K": 1.77}}'),
    ('nano-banana-2', 70000, '{"resolution_multipliers": {"1K": 1.49, "2K": 2.21, "4K": 3.29}}'),
    (
      'seedream-4-0',
      45000,
      '{"tiers": [{"min_quantity": 10, "unit_price_micros": 40000}, {"min_quantity": 50, "unit_price_micros": 35000}]}'
    ),
    ('seedream-5-0-lite', 53000, '{}')
) as prices (slug, unit_price_micros, pricing_rules)
join public.generation_models as models on models.slug = prices.slug
on conflict (model_id) do nothing;
